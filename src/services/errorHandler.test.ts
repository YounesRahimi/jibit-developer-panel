import {beforeEach, describe, expect, it, vi} from 'vitest'
import {notification} from 'antd'
import {handleApiError} from './errorHandler'
import {HitmanApiError} from '../types/errors'

vi.mock('antd', () => ({
  notification: {
    error: vi.fn(),
    info: vi.fn(),
    destroy: vi.fn(),
  },
}))

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handleApiError', () => {
    it('handles Hitman API error format correctly', () => {
      const hitmanError: HitmanApiError = {
        httpStatusCode: 400,
        code: 'invalid.request_body',
        message: 'Empty or invalid request body',
        fingerprint: 'b466d36cfec1fe03',
        details: "java.lang.IllegalArgumentException: Invalid format for field 'startDate': 1404-09-9",
      }

      const error = {
        response: {
          data: hitmanError,
        },
      }

      handleApiError(error)

      expect(notification.error).toHaveBeenCalledTimes(1)
      expect(notification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error',
          duration: 6,
          placement: 'topRight',
        })
      )
    })

    it('shows fingerprint in the notification', () => {
      const hitmanError: HitmanApiError = {
        httpStatusCode: 400,
        code: 'invalid.request_body',
        message: 'Empty or invalid request body',
        fingerprint: 'b466d36cfec1fe03',
      }

      const error = {
        response: {
          data: hitmanError,
        },
      }

      handleApiError(error)

      const callArgs = vi.mocked(notification.error).mock.calls[0][0]
      expect(callArgs).toBeDefined()
      // Fingerprint should be included in the description
      expect(callArgs.description).toBeDefined()
    })

    it('includes Show Details button when details field exists', () => {
      const hitmanError: HitmanApiError = {
        httpStatusCode: 400,
        code: 'invalid.request_body',
        message: 'Empty or invalid request body',
        fingerprint: 'b466d36cfec1fe03',
        details: 'Some detailed error message',
      }

      const error = {
        response: {
          data: hitmanError,
        },
      }

      handleApiError(error)

      const callArgs = vi.mocked(notification.error).mock.calls[0][0]
      expect(callArgs.btn).toBeDefined()
    })

    it('does not include Show Details button when details field is missing', () => {
      const hitmanError: HitmanApiError = {
        httpStatusCode: 400,
        code: 'invalid.request_body',
        message: 'Empty or invalid request body',
        fingerprint: 'b466d36cfec1fe03',
      }

      const error = {
        response: {
          data: hitmanError,
        },
      }

      handleApiError(error)

      const callArgs = vi.mocked(notification.error).mock.calls[0][0]
      expect(callArgs.btn).toBeUndefined()
    })

    it('handles non-Hitman API errors with fallback', () => {
      const standardError = new Error('Network error')

      handleApiError(standardError)

      expect(notification.error).toHaveBeenCalledTimes(1)
      expect(notification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error',
          description: 'Network error',
          duration: 4,
          placement: 'topRight',
        })
      )
    })

    it('handles unknown errors with fallback message', () => {
      const unknownError = { someField: 'someValue' }

      handleApiError(unknownError)

      expect(notification.error).toHaveBeenCalledTimes(1)
      expect(notification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error',
          description: 'An unexpected error occurred',
        })
      )
    })

    it('handles errors without response data', () => {
      const error = {
        response: {},
      }

      handleApiError(error)

      expect(notification.error).toHaveBeenCalledTimes(1)
      expect(notification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error',
          description: 'An unexpected error occurred',
        })
      )
    })
  })
})
