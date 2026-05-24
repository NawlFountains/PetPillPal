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
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('dose_logs')
      .select('*, profiles!dose_logs_given_by_fkey(display_name)')
      .gte('given_at', `${today}T00:00:00`)
      .lte('given_at', `${today}T23:59:59`)

    console.log('dose logs:', JSON.stringify(data, null, 2))
    console.log('error:', error)
    
    setDoseLogs(data ?? [])
  }

    return (
    <AuthContext.Provider value={{ session, profile, families, doseLogs , loading, refreshFamilies, refreshDoseLogs }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)