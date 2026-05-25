import { supabase } from "@/lib/supabase"
import * as Notifications from 'expo-notifications'
import { useState } from "react"
import { Platform } from "react-native"

export function useLogout() {
    const [loading, setLoading] = useState(false)

    async function handleLogout() {
        setLoading(true)
        try {
            if (Platform.OS !== 'web') {
                try {
                    // Get the exact token string associated with this device
                    const tokenData = await Notifications.getExpoPushTokenAsync()
                    const token = tokenData.data

                    if (token) {
                        // Delete the token row so the backend stops sending alerts here
                        await supabase
                            .from('push_tokens')
                            .delete()
                            .eq('token', token)
                    }

                    // Wipe out all locally scheduled alarms/reminders from device memory
                    await Notifications.cancelAllScheduledNotificationsAsync()
                } catch (tokenError) {
                    console.error("Failed to clean up notification tokens during logout:", tokenError)
                }
            }

            // 2. Perform the actual Supabase global sign out
            await supabase.auth.signOut()

        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            setLoading(false)
        }
    }

    return { loading, handleLogout }
}