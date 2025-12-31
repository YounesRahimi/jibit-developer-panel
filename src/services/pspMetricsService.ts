import api from './api'
import {PspMetricsRequest, PspMetricsResponse} from '../types/pspMetrics'

export const pspMetricsService = {
  getPspMetrics: async (request: PspMetricsRequest): Promise<PspMetricsResponse> => {
    const response = await api.post<PspMetricsResponse>(
      '/v1/requests?subject=projectx.v3.metrics.psp',
      request
    )
    return response.data
  },
}
