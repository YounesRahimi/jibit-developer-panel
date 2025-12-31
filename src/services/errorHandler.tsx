import React from 'react'
import {notification} from 'antd'
import {HitmanApiError, isHitmanApiError} from '../types/errors'

/**
 * Global error handler for API errors
 * Handles Hitman API error format and displays user-friendly notifications
 *
 * @author Younes Rahimi
 */
export const handleApiError = (error: unknown): void => {
  if (isHitmanApiError(error)) {
    const errorData: HitmanApiError = error.response.data

    // Build description with fingerprint
    const descriptionParts: React.ReactNode[] = [errorData.message]

    // Add fingerprint in a subtle way
    if (errorData.fingerprint) {
      descriptionParts.push(
        <div key="fingerprint" style={{ marginTop: 8, fontSize: '12px', opacity: 0.7 }}>
          Fingerprint: <code>{errorData.fingerprint}</code>
        </div>
      )
    }

    // Show notification
    notification.error({
      message: 'Error',
      description: (
        <div>
          {descriptionParts.map((part, index) => (
            <div key={index}>{part}</div>
          ))}
        </div>
      ),
      duration: 6,
      placement: 'topRight',
      btn: errorData.details ? (
        <button
          onClick={() => showErrorDetails(errorData)}
          style={{
            padding: '4px 12px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
            background: 'white',
            cursor: 'pointer',
          }}
        >
          Show Details
        </button>
      ) : undefined,
    })
  } else {
    // Fallback for non-Hitman errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    notification.error({
      message: 'Error',
      description: errorMessage,
      duration: 4,
      placement: 'topRight',
    })
  }
}

/**
 * Shows detailed error information in a modal
 */
const showErrorDetails = (errorData: HitmanApiError): void => {
  notification.destroy('error-details')

  notification.info({
    key: 'error-details',
    message: 'Error Details',
    description: (
      <div style={{ maxHeight: '300px', overflow: 'auto' }}>
        <div style={{ marginBottom: 8 }}>
          <strong>Code:</strong> {errorData.code}
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Message:</strong> {errorData.message}
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Fingerprint:</strong> <code>{errorData.fingerprint}</code>
        </div>
        {errorData.details && (
          <div>
            <strong>Details:</strong>
            <pre style={{
              marginTop: 8,
              padding: 8,
              background: '#f5f5f5',
              borderRadius: 4,
              fontSize: '12px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {errorData.details}
            </pre>
          </div>
        )}
      </div>
    ),
    duration: 0, // Don't auto-close
    placement: 'topRight',
    style: { minWidth: '500px' },
  })
}
