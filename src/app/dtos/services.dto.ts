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
  color: string
}

export interface UpdateServiceDto {
  name: string
  description: string
  duration: number  // Duration in minutes
  price: number
  color: string
}
