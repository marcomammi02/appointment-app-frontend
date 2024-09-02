export interface ServiceDto {
  id: number
  name: string
  description: string
  duration: number  // Duration in minutes
  price: number
}

export interface CreateServiceDto {
  name: string
  description: string
  duration: number  // Duration in minutes
  price: number
  shopId: number
}
