export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Supabase requires that the password is larger than 5 digits, this way we skip quering something that we now it fails
export function isValidPassword(password: string): boolean {
  return password.length >= 6 
}

export function isValidTime(time: string): boolean {
  const timeRegex = /^\d{2}:\d{2}$/
  return timeRegex.test(time)
}

export function isValidDate(date: string): boolean {
  if (!date.trim()) return false

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false

  const [year, month, day] = date.split('-').map(Number)

  if (month < 1 || month > 12) return false
  if (day < 1) return false

  const daysInMonth = getDaysInMonth(year, month)
  if (day > daysInMonth) return false

  return true
}

function getDaysInMonth(year: number, month: number): number {
  const thirtyOneDays = [1, 3, 5, 7, 8, 10, 12]
  const thirtyDays = [4, 6, 9, 11]

  if (thirtyOneDays.includes(month)) return 31
  if (thirtyDays.includes(month)) return 30

  // February
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  return isLeapYear ? 29 : 28
}

export function isDateBefore(date1: string, date2: string): boolean {
  return new Date(date1) < new Date(date2)
}
