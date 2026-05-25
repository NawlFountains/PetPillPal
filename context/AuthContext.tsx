import { DoseLog, Family, Profile } from '@/lib/definitions'
import { scheduleAllNotifications } from '@/lib/notifications'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { createContext, useContext, useEffect, useState } from 'react'
import { Platform } from 'react-native'

type AuthContextType = {
    session: Session | null
    profile: Profile | null
    families: Family[]
    doseLogs: DoseLog[]
    loading: boolean
    refreshFamilies: () => Promise<void>
    refreshDoseLogs: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    profile: null,
    families: [],
    doseLogs: [],
    loading: true,
    refreshFamilies: async () => {},
    refreshDoseLogs: async () => {}
})

async function registerForPushNotifications() {
  console.log('Platform is ', Platform.OS)
  if (Platform.OS === 'web') {
    console.log('Running on web: Skipping Expo Push Token generation')
    return null
  }
  if (!Device.isDevice) return null

  // Check if already granted permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  // If not then ask for it
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  // Teh user didnt allow it so we cant register push notifications
  if (finalStatus !== 'granted') return null

  const token = (await Notifications.getExpoPushTokenAsync()).data
  return token
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [families, setFamilies] = useState<Family[]>([])
    const [doseLogs, setDoseLogs] = useState<DoseLog[]>([])
    const [loading, setLoading] = useState(true)

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
    if (token && profileRes.data) {
      await supabase
        .from('push_tokens')
        .upsert({ user_id: profileRes.data.id, token }, { onConflict: 'user_id' })
    }


    setProfile(profileRes.data)
    setFamilies(fetchedFamilies)
    setDoseLogs(fetchedLogs)
    setLoading(false)

    await scheduleAllNotifications(fetchedFamilies, fetchedLogs)
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

    setFamilies(data?.map((m: any) => m.families) ?? [])
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
    <AuthContext.Provider value={{ session, profile, families, doseLogs , loading, refreshFamilies, refreshDoseLogs }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)