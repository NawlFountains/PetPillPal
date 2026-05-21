export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Supabase requires that the password is larger than 5 digits, this way we skip quering something that we now it fails
export function isValidPassword(password: string): boolean {
  return password.length >= 6 
}