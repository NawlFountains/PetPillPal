import { DoseLog, Schedule } from "./definitions"

export function formatLocalTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()

  const time = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.round((todayOnly.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return `today at ${time}`
  if (diffDays === 1) return `yesterday at ${time}`

  const weekday = date.toLocaleDateString([], { weekday: 'long' })
  return `${weekday} at ${time}`
}

export function isScheduledToday(schedule: Schedule): boolean {
    return isScheduledOnDate(schedule, new Date())
}

export function isOverdue(schedule: Schedule, doseLogs: DoseLog[]): boolean {
    
    const today = new Date()
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    // Check past days this schedule was supposed to run
    for (let i = 1; i <= 7; i++) {
        const checkDate = new Date(todayOnly)
        checkDate.setDate(checkDate.getDate() - i)

        // Was it scheduled on this past day?
        const wasScheduled = isScheduledOnDate(schedule, checkDate)
        if (!wasScheduled) continue

        // Was it given on this past day?
        const wasGiven = doseLogs.some(log => {
            const logDate = new Date(log.given_at)
            const logDateOnly = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate())
            return log.schedule_id === schedule.id &&
            logDateOnly.getTime() === checkDate.getTime()
        })

        if (!wasGiven) return true
    }

    return false
}

export function isScheduledOnDate(schedule: Schedule, date: Date): boolean {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (schedule.starts_on) {
        const [y, m, d] = schedule.starts_on.split('-').map(Number)
        const startsOn = new Date(y, m - 1, d)
        if (dateOnly < startsOn) return false
    }

    if (schedule.ends_on) {
        const [y, m, d] = schedule.ends_on.split('-').map(Number)
        const endsOn = new Date(y, m - 1, d)
        if (dateOnly > endsOn) return false
    }

    if (schedule.frequency === 'daily') return true

    if (schedule.frequency === 'weekly') {
        const day = date.getDay()
        const mapped = day === 0 ? 7 : day
        return schedule.days_of_week?.map(Number).includes(mapped) ?? false
    }

return true
}

export function obscureEmail(email: string) : string {
    const [local, domain] = email.split('@')
    const visibleCount = Math.min(2, local.length - 1)
    const visible = local.substring(0, visibleCount)
    const hidden = '*'.repeat(local.length - visibleCount)
    return `${visible}${hidden}@${domain}`
}


