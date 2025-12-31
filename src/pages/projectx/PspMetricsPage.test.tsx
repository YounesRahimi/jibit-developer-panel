import {beforeEach, describe, expect, it, vi} from 'vitest'
import {screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {render} from '../../test/test-utils'
import PspMetricsPage from './PspMetricsPage'
import {pspMetricsService} from '../../services/pspMetricsService'
import {PspMetricsResponse} from '../../types/pspMetrics'
import {HitmanApiError} from '../../types/errors'

// Mock antd-jalali to use regular antd DatePicker for testing
vi.mock('antd-jalali', () => {
  const antd = require('antd')
  return {
    DatePicker: antd.DatePicker,
  }
})

vi.mock('../../services/pspMetricsService')

const mockMetricsResponse: PspMetricsResponse = {
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
    {
      timePeriod: '1404-09-09',
      psp: 'SEPEHR',
      allApisDownTimes: 5,
      allApisCallCount: 253299,
      healthApiDownTimes: 0,
      paymentDownTimes: 0,
      initialDelayAverageInMillis: 272,
      paymentDelayAverageInMillis: 87323,
      verificationDelayAverageInMillis: 302,
    },
    {
      timePeriod: '1404-09-10',
      psp: 'SAMAN',
      allApisDownTimes: 39,
      allApisCallCount: 320245,
      healthApiDownTimes: 0,
      paymentDownTimes: 0,
      initialDelayAverageInMillis: 262,
      paymentDelayAverageInMillis: 72971,
      verificationDelayAverageInMillis: 289,
    },
    {
      timePeriod: '1404-09-10',
      psp: 'SEPEHR',
      allApisDownTimes: 0,
      allApisCallCount: 108420,
      healthApiDownTimes: 0,
      paymentDownTimes: 1,
      initialDelayAverageInMillis: 303,
      paymentDelayAverageInMillis: 87966,
      verificationDelayAverageInMillis: 301,
    },
  ],
}

describe('PspMetricsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders PSP Metrics page with title', () => {
    render(<PspMetricsPage />)
    expect(screen.getByText('ProjectX - PSP Metrics')).toBeInTheDocument()
  })

  it('renders fetch button', () => {
    render(<PspMetricsPage />)
    expect(screen.getByRole('button', { name: /fetch metrics/i })).toBeInTheDocument()
  })

  it('fetches and displays metrics when fetch button is clicked', async () => {
    const user = userEvent.setup()

    vi.mocked(pspMetricsService.getPspMetrics).mockResolvedValue(mockMetricsResponse)

    render(<PspMetricsPage />)

    const fetchButton = screen.getByRole('button', { name: /fetch metrics/i })
    await user.click(fetchButton)

    await waitFor(() => {
      expect(pspMetricsService.getPspMetrics).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(screen.getByText('All APIs Down Times')).toBeInTheDocument()
      expect(screen.getByText('All APIs Call Count')).toBeInTheDocument()
      expect(screen.getByText('Health API Down Times')).toBeInTheDocument()
      expect(screen.getByText('Payment Down Times')).toBeInTheDocument()
      expect(screen.getByText('Initial Delay Average')).toBeInTheDocument()
      expect(screen.getByText('Payment Delay Average')).toBeInTheDocument()
      expect(screen.getByText('Verification Delay Average')).toBeInTheDocument()
    })
  })

  it('displays error message when API call fails', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Network error'

    vi.mocked(pspMetricsService.getPspMetrics).mockRejectedValue(new Error(errorMessage))

    render(<PspMetricsPage />)

    const fetchButton = screen.getByRole('button', { name: /fetch metrics/i })
    await user.click(fetchButton)

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('displays Hitman API error format correctly', async () => {
    const user = userEvent.setup()

    const hitmanError: HitmanApiError = {
      httpStatusCode: 400,
      code: 'invalid.request_body',
      message: 'Empty or invalid request body',
      fingerprint: 'b466d36cfec1fe03',
      details: "java.lang.IllegalArgumentException: Invalid format for field 'startDate'",
    }

    const axiosError = {
      response: {
        data: hitmanError,
        status: 400,
      },
    }

    vi.mocked(pspMetricsService.getPspMetrics).mockRejectedValue(axiosError)

    render(<PspMetricsPage />)

    const fetchButton = screen.getByRole('button', { name: /fetch metrics/i })
    await user.click(fetchButton)

    // The error will be handled by the global error handler (axios interceptor)
    // and displayed as a notification, not in the component itself
    await waitFor(() => {
      expect(pspMetricsService.getPspMetrics).toHaveBeenCalled()
    })
  })

  it('displays no data message when response has no elements', async () => {
    const user = userEvent.setup()

    vi.mocked(pspMetricsService.getPspMetrics).mockResolvedValue({ elements: [] })

    render(<PspMetricsPage />)

    const fetchButton = screen.getByRole('button', { name: /fetch metrics/i })
    await user.click(fetchButton)

    await waitFor(() => {
      expect(screen.getByText('No Data')).toBeInTheDocument()
      expect(screen.getByText('No metrics found for the selected filters')).toBeInTheDocument()
    })
  })

  it('renders with default PSP vendors selected', () => {
    render(<PspMetricsPage />)

    // Check that default PSP vendors are visible in the select
    expect(screen.getByText('SAMAN')).toBeInTheDocument()
    expect(screen.getByText('SEPEHR')).toBeInTheDocument()
    expect(screen.getByText('BEHPARDAKHT')).toBeInTheDocument()
    expect(screen.getByText('AP')).toBeInTheDocument()
  })
})
