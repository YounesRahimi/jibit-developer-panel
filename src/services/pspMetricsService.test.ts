import {beforeEach, describe, expect, it, vi} from 'vitest'
import {pspMetricsService} from './pspMetricsService'
import api from './api'
import {PspMetricsRequest, PspMetricsResponse} from '../types/pspMetrics'
import {HitmanApiError} from '../types/errors'

vi.mock('./api')

describe('pspMetricsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPspMetrics', () => {
    it('calls the correct API endpoint with request body', async () => {
      const request: PspMetricsRequest = {
        pspVendors: ['SAMAN', 'SEPEHR'],
        startDate: '1404-08-25',
        endDate: '1404-09-10',
        aggregationPeriod: 'DAY',
      }

      const mockResponse: PspMetricsResponse = {
        elements: [
          {
            timePeriod: '1404-09-09',
            psp: 'SAMAN',
            allApisDownTimes: 1,
            allApisCallCount: 195408,
            healthApiDownTimes: 0,
            paymentDownTimes: 0,
            initialDelayAverageInMillis: 247,
            paymentDelayAverageInMillis: 69195,
            verificationDelayAverageInMillis: 268,
          },
        ],
      }

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse })

      const result = await pspMetricsService.getPspMetrics(request)

      expect(api.post).toHaveBeenCalledWith(
        '/v1/requests?subject=projectx.v3.metrics.psp',
        request
      )
      expect(result).toEqual(mockResponse)
    })

    it('handles API errors correctly', async () => {
      const request: PspMetricsRequest = {
        pspVendors: ['SAMAN'],
        startDate: '1404-08-25',
        endDate: '1404-09-10',
        aggregationPeriod: 'DAY',
      }

      const errorMessage = 'Network error'
      vi.mocked(api.post).mockRejectedValue(new Error(errorMessage))

      await expect(pspMetricsService.getPspMetrics(request)).rejects.toThrow(errorMessage)
    })

    it('handles Hitman API error format', async () => {
      const request: PspMetricsRequest = {
        pspVendors: ['SAMAN'],
        startDate: '1404-09-9', // Invalid format
        endDate: '1404-09-10',
        aggregationPeriod: 'DAY',
      }

      const hitmanError: HitmanApiError = {
        httpStatusCode: 400,
        code: 'invalid.request_body',
        message: 'Empty or invalid request body',
        fingerprint: 'b466d36cfec1fe03',
        details: "java.lang.IllegalArgumentException: Invalid format for field 'startDate': 1404-09-9. Acceptable format is 'Value(YearOfEra,4,19,EXCEEDS_PAD)'-'Value(MonthOfYear,2)'-'Value(DayOfMonth,2)'",
      }

      const axiosError = {
        response: {
          data: hitmanError,
          status: 400,
        },
      }

      vi.mocked(api.post).mockRejectedValue(axiosError)

      await expect(pspMetricsService.getPspMetrics(request)).rejects.toEqual(axiosError)
    })

    it('handles Hitman API error without details field', async () => {
      const request: PspMetricsRequest = {
        pspVendors: ['SAMAN'],
        startDate: '1404-08-25',
        endDate: '1404-09-10',
        aggregationPeriod: 'DAY',
      }

      const hitmanError: HitmanApiError = {
        httpStatusCode: 500,
        code: 'internal.server_error',
        message: 'An internal server error occurred',
        fingerprint: 'a1b2c3d4e5f6g7h8',
      }

      const axiosError = {
        response: {
          data: hitmanError,
          status: 500,
        },
      }

      vi.mocked(api.post).mockRejectedValue(axiosError)

      await expect(pspMetricsService.getPspMetrics(request)).rejects.toEqual(axiosError)
    })

    it('sends empty array for pspVendors to fetch all vendors', async () => {
      const request: PspMetricsRequest = {
        pspVendors: [],
        startDate: '1404-08-25',
        endDate: '1404-09-10',
        aggregationPeriod: 'WEEK',
      }

      const mockResponse: PspMetricsResponse = {
        elements: [],
      }

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse })

      await pspMetricsService.getPspMetrics(request)

      expect(api.post).toHaveBeenCalledWith(
        '/v1/requests?subject=projectx.v3.metrics.psp',
        expect.objectContaining({ pspVendors: [] })
      )
    })

    it('supports different aggregation periods', async () => {
      const periods: Array<'DAY' | 'WEEK' | 'MONTH'> = ['DAY', 'WEEK', 'MONTH']

      for (const period of periods) {
        vi.mocked(api.post).mockResolvedValue({ data: { elements: [] } })

        await pspMetricsService.getPspMetrics({
          pspVendors: ['SAMAN'],
          startDate: '1404-08-25',
          endDate: '1404-09-10',
          aggregationPeriod: period,
        })

        expect(api.post).toHaveBeenCalledWith(
          '/v1/requests?subject=projectx.v3.metrics.psp',
          expect.objectContaining({ aggregationPeriod: period })
        )
      }
    })
  })
})
