export interface AvailabilityDayDto {
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
