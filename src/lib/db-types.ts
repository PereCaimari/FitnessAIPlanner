// Auto-generated from your database schema — do not edit by hand.
// Regenerates automatically whenever a table is created or altered.

export type UsersRow = {
  id: string
  email: string
  emailVerified: number | string | null
  displayName: string | null
  avatarUrl: string | null
  phone: string | null
  phoneVerified: number | string | null
  role: string | null
  metadata: string | null
  createdAt: string
  updatedAt: string
  lastSignIn: string
}

export type WorkoutsRow = {
  id: string
  title: string
  type: string
  workoutDate: string
  duration: string
  rpe: number | string
  distance: string | null
  pace: string | null
  exercisesJson: string | null
  gpxSplitsJson: string | null
  createdAt: string
  userId: string
}
