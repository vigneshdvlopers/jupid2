export interface User {
  id: number
  name: string
  email: string
  google_id: string
  plan: string
  is_admin: boolean
  created_at: string
}

export interface Competitor {
  id: number
  company_name: string
  domain: string
  amazon_asin: string
  stock_ticker: string
  industry: string
}

export interface Report {
  id: number
  user_id: number
  competitor_id: number
  content: string
  report_type: string
  created_at: string
}

export interface Notification {
  id: number
  competitor_id: number
  notification_type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export interface Message {
  id: number
  user_id: number
  message: string
  is_read: boolean
  created_at: string
}

export interface StockDataPoint {
  date: string
  price: number
  volume: number
}

export interface SalesDataPoint {
  month: string
  revenue: number
  units: number
}
