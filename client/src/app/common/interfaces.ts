export interface User {
  username: string
  password: string
}

export interface Position {
  id?: number
  name: string
  article: string
  quantity: number
  cost: number
  cost_of_sale: number
  alias_id?: string
}

export interface Companion {
  id?: number
  full_name: string
  phone: string
  percent: number
}

export interface PositionToOrder {
  order?: number
  position: number | Position 
  name: string
  article: string
  quantity: number
  cost: number
  cost_of_sale: number
  companion?: number | string
  companion_percent?: number

  //var angular
  amount: number
  alias_id: string
}

export interface CompanionToOrder {
  order?: number
  companion: number | Companion
  cost_of_work: number
  done?: boolean
}

export interface DetailToOrder {
  order?: number
  full_name: string
  phone: string
  address_delivery?: string
  sale: number
}

export interface Order {
  id?: number
  done?: boolean
  detail: DetailToOrder
  companion?: CompanionToOrder
  positions: PositionToOrder[]
  date_added?: Date
}

export interface link {
  url: string
  name: string
  has_button: boolean
  tooltip_button?: string
}