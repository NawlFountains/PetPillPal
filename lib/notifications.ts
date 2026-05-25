import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DoseLog, Family } from "./definitions";
import { isScheduledOnDate } from './utils';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldShowBanner: true,
        shouldSetBadge: false,
        shouldShowList: true
    }),
})

// To avoid race condition we use a mutex
let isScheduling = false;

export async function scheduleAllNotifications(families: Family[], doseLogs: DoseLog[], reminderMinutes: number = 30) {
    // If an instance is already running, block this call
    if (isScheduling) {
        console.log('[DEBUG] Scheduling already in progress. Skipping duplicate run.');
        return;
    }
    try {
        isScheduling = true; // Set the lock
        if (Platform.OS === 'web') {
                return;
            }
        // console.log('IN notifications.ts with ',families)
        await Notifications.cancelAllScheduledNotificationsAsync()
    
        const now = new Date()
        // console.log('Now is ',now)
        const MAX_DAYS_TO_SCHEDULE = 6
        let loopMatchCounter = 0
    
    
        for (const family of families) {
            for (const animal of family.animals ?? []) {
                // console.log(`On loop with ${animal.name}`)
                for (const medication of animal.medications ?? []) {
                    // console.log(`On loop with ${medication.name}`)
                    for (const schedule of medication.medication_schedules ?? []) {
                        // console.log(`How many schedules does ${animal.name} has ${medication.medication_schedules.length}`)
    
                        for (let daysOffset = 0; daysOffset < MAX_DAYS_TO_SCHEDULE;  daysOffset++) {
                            const checkDate = new Date()
                            checkDate.setDate(now.getDate() + daysOffset)
    
                            if (!isScheduledOnDate(schedule, checkDate)) continue
    
                            if (daysOffset == 0) {
                                const alreadyGiven = doseLogs.some(log => log.schedule_id === schedule.id);
                                if (alreadyGiven) continue
                            }
    
                            const [hours, minutes] = schedule.time.split(':').map(Number)
    
                            let triggerMinute = minutes - reminderMinutes
                            let triggerHour = hours
    
    
                            if (triggerMinute < 0) {
                                triggerMinute += 60
                                triggerHour -= 1
                            }
                            if (triggerHour < 0) triggerHour = 23
    
                            loopMatchCounter++;
    
                            const triggerDate = new Date(checkDate)
                            triggerDate.setHours(triggerHour, triggerMinute, 0, 0)
    
                            if (triggerDate <= now) continue
    
                            // console.log('Scheduling notification for at ',animal.name)
                            // For testing: Set the trigger to 5 seconds from right now
                            // const testTriggerDate = new Date(Date.now() + 5000);
                            // console.log('Scheduled ',schedule.time,'',schedule, ' on ',triggerDate)

                            
                            await Notifications.scheduleNotificationAsync({
                                content: {
                                    title: 'Upcoming medication',
                                    body: `${animal.name} scheduled to take ${medication.name} in ${reminderMinutes} minutes.`,
                                },
                                trigger: {
                                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                                    date: triggerDate,
                                }
                            })
                        }
                    }
                }
            }
        }

        // 3. Log the final results after all loops finish
        const totalInOSQueue = await Notifications.getAllScheduledNotificationsAsync();
        console.log(`==================================================`);
        console.log(`[DEBUG] Loops found valid slots: ${loopMatchCounter}`);
        console.log(`[DEBUG] Total actually registered in OS: ${totalInOSQueue.length}`);
        console.log(`==================================================`);
    } finally {
        isScheduling = false; // Release
    }
}