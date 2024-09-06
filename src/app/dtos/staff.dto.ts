export interface CreateStaffDto {
  name: string
  lastName?: string
  role?: string
  shopId: number
}

export interface UpdateStaffDto {
  name: string
  lastName?: string
  role?: string
}

export interface StaffDto {
  id: number
  name: string
  lastName: string
  role: string
}
