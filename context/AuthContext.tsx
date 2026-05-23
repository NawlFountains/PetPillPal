import { Family, Profile } from '@/lib/definitions'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
    session: Session | null
    profile: Profile | null
    families: Family[]
    loading: boolean
    refreshFamilies: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    profile: null,
    families: [],
    loading: true,
    refreshFamilies: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [families, setFamilies] = useState<Family[]>([])
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
    const [profileRes, familiesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase
        .from('family_member')
        .select('families(*, animals(*))')
        .eq('user_id', userId)
    ])

    setProfile(profileRes.data)
    setFamilies(familiesRes.data?.map((m: any) => m.families) ?? [])
    setLoading(false)
  }

  async function refreshFamilies() {
    if (!profile) return
    const { data } = await supabase
      .from('family_member')
      .select('families(*, animals(*))')
      .eq('user_id', profile.id)

    setFamilies(data?.map((m: any) => m.families) ?? [])
  }

    return (
    <AuthContext.Provider value={{ session, profile, families, loading, refreshFamilies }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)