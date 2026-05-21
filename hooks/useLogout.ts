import { supabase } from "@/lib/supabase"
import { useState } from "react"

export function useLogout() {
    const [loading, setLoading] = useState(false)
    async function handleLogout() {
        setLoading(true)
        await supabase.auth.signOut()
        setLoading(false)
    }
    return { loading, handleLogout }
}