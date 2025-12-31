# Global Error Handler for Hitman API

This documentation explains the global error handling system implemented for Hitman.jibit.cloud APIs.

## Overview

The global error handler automatically intercepts all API errors and displays user-friendly notifications using Ant Design's notification component. It specifically handles the Hitman API error format while also providing fallback handling for other error types.

## Features

### 1. **Automatic Error Detection**
The system automatically detects Hitman API errors based on the standard error format:

```json
{
  "httpStatusCode": 400,
  "code": "invalid.request_body",
  "message": "Empty or invalid request body",
  "fingerprint": "b466d36cfec1fe03",
  "details": "java.lang.IllegalArgumentException: Invalid format..."
}
```

### 2. **User-Friendly Notifications**
Errors are displayed as Ant Design notifications with:
- Clear error message
- Fingerprint display (subtle, non-intrusive)
- Optional "Show Details" button for technical details
- Auto-dismissal (or manual close)

### 3. **Developer-Friendly Details**
When the error includes a `details` field:
- A "Show Details" button appears in the notification
- Clicking it opens a detailed view with:
  - Error code
  - Full message
  - Fingerprint (for tracking)
  - Detailed technical information

## Architecture

### Files Structure

```
src/
├── types/
│   └── errors.ts                 # Type definitions and type guards
├── services/
│   ├── api.ts                    # Axios instance with interceptors
│   ├── errorHandler.tsx          # Error handling logic and UI
│   └── errorHandler.test.ts      # Tests for error handler
```

### Type Definitions (`types/errors.ts`)

```typescript
export interface HitmanApiError {
  httpStatusCode: number
  code: string
  message: string
  fingerprint: string
  details?: string
}

export const isHitmanApiError = (error: unknown): error is { response: { data: HitmanApiError } } => {
  // Type guard implementation
}
```

### Error Handler (`services/errorHandler.tsx`)

The `handleApiError` function:
1. Checks if the error matches Hitman API format
2. Displays appropriate notification
3. Provides "Show Details" button when applicable
4. Falls back to generic error handling for non-Hitman errors

### API Interceptor (`services/api.ts`)

The axios response interceptor automatically calls `handleApiError` for all failed requests:

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else {
      // Handle all other errors globally
      handleApiError(error)
    }
    return Promise.reject(error)
  }
)
```

## Usage

### Automatic Handling

No special code is required! All API calls made through the `api` instance are automatically handled:

```typescript
import api from './services/api'

// Errors are automatically handled
const fetchData = async () => {
  try {
    const response = await api.post('/v1/requests?subject=some.subject', data)
    return response.data
  } catch (error) {
    // Error is already displayed to user via notification
    // You can still handle it programmatically if needed
    console.error('Operation failed', error)
  }
}
```

### Manual Error Handling

You can also manually call the error handler:

```typescript
import { handleApiError } from './services/errorHandler'

try {
  // Some operation
} catch (error) {
  handleApiError(error)
}
```

## Testing

### Unit Tests

The error handler is fully tested in `errorHandler.test.ts`:

```typescript
it('handles Hitman API error format correctly', () => {
  const hitmanError: HitmanApiError = {
    httpStatusCode: 400,
    code: 'invalid.request_body',
    message: 'Empty or invalid request body',
    fingerprint: 'b466d36cfec1fe03',
    details: "java.lang.IllegalArgumentException: Invalid format...",
  }

  handleApiError({ response: { data: hitmanError } })

  expect(notification.error).toHaveBeenCalled()
})
```

### Integration Tests

Service tests now include Hitman error format scenarios:

```typescript
it('handles Hitman API error format', async () => {
  const hitmanError: HitmanApiError = {
    httpStatusCode: 400,
    code: 'invalid.request_body',
    message: 'Empty or invalid request body',
    fingerprint: 'b466d36cfec1fe03',
  }

  vi.mocked(api.post).mockRejectedValue({
    response: { data: hitmanError, status: 400 }
  })

  await expect(service.method(params)).rejects.toBeTruthy()
})
```

## UI/UX Details

### Error Notification
- **Position**: Top-right corner
- **Duration**: 6 seconds (auto-dismiss)
- **Type**: Error (red color scheme)
- **Content**:
  - Main message
  - Fingerprint (small, gray text with monospace font)
  - "Show Details" button (if details exist)

### Details Modal
- **Position**: Top-right corner
- **Duration**: Manual dismiss only
- **Type**: Info (blue color scheme)
- **Content**:
  - Error code
  - Full message
  - Fingerprint (for tracking)
  - Detailed technical information (scrollable)

### Fingerprint Display

The fingerprint is displayed in a subtle, non-intrusive way:
```tsx
<div style={{ marginTop: 8, fontSize: '12px', opacity: 0.7 }}>
  Fingerprint: <code>b466d36cfec1fe03</code>
</div>
```

## Error Tracking

The fingerprint field allows administrators to track and debug specific errors:

1. User sees error notification with fingerprint
2. User reports: "I got error with fingerprint: b466d36cfec1fe03"
3. Admin searches logs for that fingerprint
4. Admin can trace the exact error occurrence

## Fallback Handling

For non-Hitman errors (network errors, timeouts, etc.):
- Generic error message is displayed
- Duration is shorter (4 seconds)
- No fingerprint or details button
- Standard JavaScript Error message is shown

## Best Practices

### 1. Don't Duplicate Error Messages
Since errors are handled globally, avoid showing additional error messages in components:

```typescript
// ❌ Bad - duplicates error display
const fetchData = async () => {
  try {
    return await api.post('/v1/requests', data)
  } catch (error) {
    message.error('Failed to fetch data') // Duplicate!
    throw error
  }
}

// ✅ Good - let global handler do its job
const fetchData = async () => {
  return await api.post('/v1/requests', data)
}
```

### 2. Handle Loading States
Show loading indicators and handle the error state:

```typescript
const [isLoading, setIsLoading] = useState(false)

const fetchData = async () => {
  setIsLoading(true)
  try {
    const result = await api.post('/v1/requests', data)
    setData(result.data)
  } finally {
    setIsLoading(false)
  }
}
```

### 3. Provide Context When Needed
For specific operations, you might want to add context:

```typescript
const deleteItem = async (id: string) => {
  try {
    await api.delete(`/v1/items/${id}`)
    message.success('Item deleted successfully')
  } catch (error) {
    // Global handler shows the error
    // You might want to add specific context
    console.error(`Failed to delete item ${id}`, error)
  }
}
```

## Customization

### Changing Notification Position

Edit `errorHandler.tsx`:

```typescript
notification.error({
  // ...other options
  placement: 'bottomRight', // Change position
})
```

### Changing Duration

```typescript
notification.error({
  // ...other options
  duration: 10, // 10 seconds
})
```

### Styling

All styles are inline for simplicity. You can move them to CSS modules or styled-components:

```typescript
// Current approach (inline)
<div style={{ fontSize: '12px', opacity: 0.7 }}>

// Alternative (CSS modules)
<div className={styles.fingerprint}>
```

## Future Enhancements

Possible improvements:
1. **Error Analytics**: Track error frequency and patterns
2. **Retry Mechanism**: Automatic retry for transient errors
3. **Error Grouping**: Group similar errors to avoid spam
4. **Custom Error Pages**: Full-page error displays for critical errors
5. **Localization**: Multi-language error messages
6. **Copy to Clipboard**: One-click copy of fingerprint/details

## Author

Younes Rahimi

## Related Files

- `src/types/errors.ts`
- `src/services/api.ts`
- `src/services/errorHandler.tsx`
- `src/services/errorHandler.test.ts`
- `src/services/pspMetricsService.test.ts`
- `src/pages/projectx/PspMetricsPage.test.tsx`
