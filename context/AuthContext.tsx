import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

type Profile = {
    id: string
    display_name: string
    created_at: string
}

type AuthContextType = {
    session: Session | null
    profile: Profile | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    profile: null,
    loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setLoading(false)
    })

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else {
        setProfile(null)
        setLoading(false)
      }
    })
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)