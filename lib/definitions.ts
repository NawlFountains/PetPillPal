export type Profile = {
    id: string
    display_name: string
    created_at: string
}

export type Animal = {
  id: string
  family_id: string
  name: string
  species: string
  created_at: string
}

export type Family = {
  id: string
  name: string
  code: string
  created_by: string
  created_at: string
  animals: Animal []
}
