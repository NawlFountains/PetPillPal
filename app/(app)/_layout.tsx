import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'


export default function AppLayout() {
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
            title: 'Family',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name='paw-outline' size={size} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name='settings'
            options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name='person-outline' size={size} color={color} />
            ),
            }}
        />
        </Tabs>
    )
}