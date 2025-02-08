export interface CreateAbsenceDto {
  date: Date;
  startTime: string;
  endTime: string;
  reason: string;
  staffId: number;
}
