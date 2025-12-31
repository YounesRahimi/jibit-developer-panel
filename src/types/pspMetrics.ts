export type PspVendor = 'SAMAN' | 'SEPEHR' | 'BEHPARDAKHT' | 'AP'

export type AggregationPeriod = 'DAY' | 'WEEK' | 'MONTH'

export interface PspMetric {
  timePeriod: string
  psp: PspVendor
  allApisDownTimes: number
  allApisCallCount: number
  healthApiDownTimes: number
  paymentDownTimes: number
  initialDelayAverageInMillis: number
  paymentDelayAverageInMillis: number
  verificationDelayAverageInMillis: number
}

export interface PspMetricsRequest {
  pspVendors: PspVendor[]
  startDate: string
  endDate: string
  aggregationPeriod: AggregationPeriod
}

export interface PspMetricsResponse {
  elements: PspMetric[]
}
