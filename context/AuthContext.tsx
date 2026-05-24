import { DoseLog, Family, Profile } from '@/lib/definitions'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

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
  console.log('profile in realtime effect:', profile)  // ← add this
    if (!profile) return

    // Subscribe to family_member changes (someone joins/leaves)
    const familiesChannel = supabase
      .channel('families-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'medication_schedules'
      }, (payload) => {
        console.log('schedule change ',payload)
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
      .subscribe((status) => {
         console.log('subscription status:', status)  // ← add this
      })

    return () => {
      supabase.removeChannel(familiesChannel)
    }
  }, [profile])

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

    setProfile(profileRes.data)
    setFamilies(familiesRes.data?.map((m: any) => m.families) ?? [])
    setDoseLogs(logsRes.data ?? [])
    setLoading(false)
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