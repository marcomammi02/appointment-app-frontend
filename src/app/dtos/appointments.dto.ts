export interface CreateAppointmentDto {
  customerName: string
  customerLastName: string
  customerPhone: string
  customerEmail: string
  notes: string
  startTime: Date | string
  endTime: Date | string
  status: string
  serviceName: string
  serviceId: number
  serviceColor: string
  staffId: number
  shopId: number
}

export interface UpdateAppointmentDto {
  customerName?: string
  customerLastName?: string
  customerPhone?: string
  customerEmail?: string
  notes?: string
  startTime?: Date | string
  endTime?: Date | string
  status?: string
  serviceName?: string
  serviceId?: number
  serviceColor?: string
  staffId?: number
  shopId?: number
}
