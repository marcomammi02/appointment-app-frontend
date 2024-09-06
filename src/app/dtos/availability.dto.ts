export interface AvailabilityDayDto {
  dayCode: number
  startWork?: string
  startBreak?: string
  endBreak?: string
  endWork?: string
}

export interface AvailabilityWeekDto {
  [key: string]: AvailabilityDayDto
}

export interface CreateAvailabilityDto {
  dayOfWeek: number
  startTime: string
  startBreak?: string | null
  endBreak?: string | null
  endTime: string
  staffId: number
}
