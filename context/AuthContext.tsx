import { DoseLog, Family, Profile } from '@/lib/definitions'
import { scheduleAllNotifications } from '@/lib/notifications'
import { supabase } from '@/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session } from '@supabase/supabase-js'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Platform, createContext, useContext, useEffect, useState } from 'react'
import { useColorScheme } from 'nativewind'

type AuthContextType = {
    session: Session | null
    profile: Profile | null
    families: Family[]
    doseLogs: DoseLog[]
    loading: boolean
    reminderMinutes: number
    setReminderMinutes: (minutes: number) => void
    refreshFamilies: () => Promise<void>
    refreshDoseLogs: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    profile: null,
    families: [],
    doseLogs: [],
    loading: true,
    reminderMinutes: 30,
    setReminderMinutes: async() => {},
    refreshFamilies: async () => {},
    refreshDoseLogs: async () => {}
})

async function registerForPushNotifications() {
  try {
    // If device is emulated or we are on web we can't use push notifications like this
    if (!Device.isDevice || Platform.OS === 'web') return null

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission denied')
      return null
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: '36f15f60-848d-4f55-99c4-98306f6967e4'  // ← add your EAS project ID
    })).data
    
    console.log('Push token:', token)
    return token
  } catch (error) {
    console.log('Push token error:', error)
    return null
  }
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [families, setFamilies] = useState<Family[]>([])
    const [doseLogs, setDoseLogs] = useState<DoseLog[]>([])
    const [reminderMinutes, setReminderMinutes] = useState(30)
    const [loading, setLoading] = useState(true)
    const { colorScheme, setColorScheme } = useColorScheme()

    useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchUserData(session.user.id)
      else setLoading(false)
    })

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchUserData(session.user.id)
      else {
        setProfile(null)
        setFamilies([])
        setLoading(false)
      }
    })
  }, [])

    useEffect(() => {
      if (!profile) return

      // Subscribe to family_member changes (someone joins/leaves)
      const familiesChannel = supabase
        .channel('families-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'medication_schedules'
        }, () => {
          refreshFamilies()
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'medications'
        }, () => {
          refreshFamilies()
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'animals'
        }, () => {
          refreshFamilies()
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'dose_logs'
        }, () => {
          refreshDoseLogs()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(familiesChannel)
      }
    }, [profile])

    useEffect(() => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)
      const msUntilMidnight = midnight.getTime() - now.getTime()

      const timeout = setTimeout(() => {
        scheduleAllNotifications(families, doseLogs)
      }, msUntilMidnight)

      return () => clearTimeout(timeout)
    }, [families, doseLogs])

  async function fetchUserData(userId: string) {
    const today = new Date().toISOString().split('T')[0]

    const [profileRes, familiesRes, logsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase
          .from('family_member')
          .select(`
            families(
              *,
              animals(
                *,
                medications(
                  *,
                  medication_schedules(*)
                )
              )
            )
          `)
          .eq('user_id', userId),
        supabase
          .from('dose_logs')
          .select('*, profiles!dose_logs_given_by_fkey(display_name)')
          .gte('given_at', `${today}T00:00:00`)
          .lte('given_at', `${today}T23:59:59`)
    ])
    const fetchedFamilies = familiesRes.data?.map((m: any) => m.families) ?? []
    const fetchedLogs = logsRes.data ?? []

    const token = await registerForPushNotifications()
    console.log('token:', token)
    console.log('profile data:', profileRes.data)

    if (token && profileRes.data) {
      const { error } = await supabase
        .from('push_tokens')
        .upsert({ 
          user_id: profileRes.data.id, 
          token 
        }, { onConflict: 'user_id' })
        console.log('token save error ',error)
    }

    const savedMinutes = await AsyncStorage.getItem('reminderMinutes')
    const minutes = savedMinutes ? Number(savedMinutes) : 30

     const savedScheme = await AsyncStorage.getItem('colorScheme')
    if (savedScheme) {
      setColorScheme(savedScheme as 'light' | 'dark')
    }
    
    setReminderMinutes(minutes)
    setProfile(profileRes.data)
    setFamilies(fetchedFamilies)
    setDoseLogs(fetchedLogs)
    setLoading(false)

    await scheduleAllNotifications(fetchedFamilies, fetchedLogs, minutes)
  }

  async function refreshFamilies() {
    if (!profile) return
    const { data } = await supabase
      .from('family_member')
      .select(`
        families(
          *,
          animals(
            *,
            medications(
              *,
              medication_schedules(*)
            )
          )
        )
      `)
      .eq('user_id', profile.id)

    const fetchedFamilies = data?.map((m: any) => m.families) ?? []
    setFamilies(fetchedFamilies)
    console.log('On refresh families')
    await scheduleAllNotifications(fetchedFamilies, doseLogs);
  }
  async function refreshDoseLogs() {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data } = await supabase
      .from('dose_logs')
      .select('*, profiles!dose_logs_given_by_fkey(display_name)')
      .gte('given_at', sevenDaysAgo.toISOString())

    setDoseLogs(data ?? [])
  }

    return (
    <AuthContext.Provider value={{ session, profile, families, doseLogs , loading, reminderMinutes, setReminderMinutes, refreshFamilies, refreshDoseLogs }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
