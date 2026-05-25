import { useAuth } from '@/context/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'


export default function AppLayout() {
    const {profile} = useAuth()
    return (
         <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#1c1c1c',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopColor: '#e5e7eb',
                },
                headerShown: false,
            }}
            >
        <Tabs.Screen
            name='index'
            options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name='home-outline' size={size} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name='family'
            options={{
            title: 'Plan',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name='calendar-outline' size={size} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name='settings'
            options={{
            title: profile?.display_name,
            tabBarIcon: ({ color, size }) => (
                <Ionicons name='person-outline' size={size} color={color} />
            ),
            }}
        />
        </Tabs>
    )
}