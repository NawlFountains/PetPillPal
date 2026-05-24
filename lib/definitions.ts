export type Profile = {
    id: string
    display_name: string
    created_at: string
}

export type DoseLog = {
  id: string
  medication_id: string
  schedule_id: string
  family_id: string
  given_by: string
  given_at: string
  scheduled_time: string
  note: string
  profiles: {
    display_name: string
  }
}

export type Schedule = {
  id: string
  time: string
  frequency: string
  days_of_week: number[]
  starts_on: string | null
  ends_on: string | null
}

export type Medication = {
  id: string
  name: string
  dose: string
  note: string
  medication_schedules : Schedule[]
}

export type Animal = {
  id: string
  family_id: string
  name: string
  species: string
  medications: Medication[]
}

export type Family = {
  id: string
  name: string
  code: string
  created_by: string
  created_at: string
  animals: Animal []
}
