import api from './api'

export interface TokenVerificationResponse {
  username: string
  token: string
  active: boolean
  permissions: string[]
  createdAt: string
  modifiedAt: string
}

export const verifyToken = async (token: string): Promise<TokenVerificationResponse> => {
  const response = await api.post<TokenVerificationResponse>('/v1/tokens', { token })
  return response.data
}
