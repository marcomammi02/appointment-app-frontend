export interface AvailabilityDayDto {
  id: number
  dayOfWeek: number
  startTime?: string
  startBreak?: string
  endBreak?: string
  endTime?: string
  staffId: number
}

export interface CreateAvailabilityDto {
  dayOfWeek: number
  startTime?: string | null
  startBreak?: string | null
  endBreak?: string | null
  endTime?: string | null
  staffId: number
}

export interface UpdateAvailabilityDto {
  startTime?: string | null
  startBreak?: string | null
  endBreak?: string | null
  endTime?: string | null
}
