export interface HitmanApiError {
  httpStatusCode: number
  code: string
  message: string
  fingerprint: string
  details?: string
}

export const isHitmanApiError = (error: unknown): error is { response: { data: HitmanApiError } } => {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  const err = error as { response?: { data?: unknown } }
  if (!err.response?.data || typeof err.response.data !== 'object') {
    return false
  }

  const data = err.response.data as Record<string, unknown>
  return (
    typeof data.httpStatusCode === 'number' &&
    typeof data.code === 'string' &&
    typeof data.message === 'string' &&
    typeof data.fingerprint === 'string'
  )
}
