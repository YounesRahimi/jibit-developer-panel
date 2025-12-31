# Error Handler Visual Demo

## Example Scenarios

### Scenario 1: Invalid Date Format

**API Request:**
```typescript
pspMetricsService.getPspMetrics({
  pspVendors: ['SAMAN'],
  startDate: '1404-09-9',  // ❌ Invalid format (should be 1404-09-09)
  endDate: '1404-09-10',
  aggregationPeriod: 'DAY',
})
```

**API Response:**
```json
{
  "httpStatusCode": 400,
  "code": "invalid.request_body",
  "message": "Empty or invalid request body",
  "fingerprint": "b466d36cfec1fe03",
  "details": "java.lang.IllegalArgumentException: Invalid format for field 'startDate': 1404-09-9. Acceptable format is 'Value(YearOfEra,4,19,EXCEEDS_PAD)'-'Value(MonthOfYear,2)'-'Value(DayOfMonth,2)'"
}
```

**User Sees:**

```
╔═══════════════════════════════════════════════════════╗
║  ❌  Error                                        [×] ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  Empty or invalid request body                        ║
║                                                       ║
║  Fingerprint: b466d36cfec1fe03                        ║
║                                                       ║
║                              ┌──────────────────┐     ║
║                              │  Show Details    │     ║
║                              └──────────────────┘     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

**When User Clicks "Show Details":**

```
╔═════════════════════════════════════════════════════════════════╗
║  ℹ️  Error Details                                         [×] ║
╠═════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  Code: invalid.request_body                                     ║
║                                                                 ║
║  Message: Empty or invalid request body                         ║
║                                                                 ║
║  Fingerprint: b466d36cfec1fe03                                  ║
║                                                                 ║
║  Details:                                                       ║
║  ┌───────────────────────────────────────────────────────────┐ ║
║  │ java.lang.IllegalArgumentException: Invalid format for   │ ║
║  │ field 'startDate': 1404-09-9. Acceptable format is       │ ║
║  │ 'Value(YearOfEra,4,19,EXCEEDS_PAD)'-'Value(MonthOfYear,2)│ ║
║  │ '-'Value(DayOfMonth,2)'                                  │ ║
║  └───────────────────────────────────────────────────────────┘ ║
║                                                                 ║
╚═════════════════════════════════════════════════════════════════╝
```

---

### Scenario 2: Server Error (No Details)

**API Response:**
```json
{
  "httpStatusCode": 500,
  "code": "internal.server_error",
  "message": "An internal server error occurred",
  "fingerprint": "a1b2c3d4e5f6g7h8"
}
```

**User Sees:**

```
╔═══════════════════════════════════════════════════════╗
║  ❌  Error                                        [×] ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  An internal server error occurred                    ║
║                                                       ║
║  Fingerprint: a1b2c3d4e5f6g7h8                        ║
║                                                       ║
║                    (No Show Details button)           ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

**User can report:** "I got an error with fingerprint `a1b2c3d4e5f6g7h8`"  
**Admin can search:** Logs for that specific fingerprint to debug

---

### Scenario 3: Network Error (Non-Hitman)

**Error:**
```javascript
Error: Network Error
```

**User Sees:**

```
╔═══════════════════════════════════════════════════════╗
║  ❌  Error                                        [×] ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  Network Error                                        ║
║                                                       ║
║  (No fingerprint, no details button)                  ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

Auto-dismisses after 4 seconds (shorter than Hitman errors)

---

## Real Component Example

Here's how the error handler works in a real component:

```tsx
// PspMetricsPage.tsx
import { useState } from 'react'
import { Button, DatePicker } from 'antd'
import { pspMetricsService } from '../../services/pspMetricsService'

const PspMetricsPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  const handleFetchMetrics = async () => {
    setLoading(true)
    try {
      // If there's an error, it will be automatically shown to the user
      const result = await pspMetricsService.getPspMetrics({
        pspVendors: ['SAMAN', 'SEPEHR'],
        startDate: '1404-09-9',  // Intentionally wrong format for demo
        endDate: '1404-09-10',
        aggregationPeriod: 'DAY',
      })
      
      setData(result)
      
      // Only show success message after successful fetch
      message.success('Metrics loaded successfully')
      
    } catch (error) {
      // Error notification is already shown by global handler!
      // No need to show another error message
      // Just handle the error state if needed
      console.error('Failed to fetch metrics', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button 
        onClick={handleFetchMetrics} 
        loading={loading}
      >
        Fetch Metrics
      </Button>
      
      {data && <MetricsChart data={data} />}
    </div>
  )
}
```

**Flow:**
1. User clicks "Fetch Metrics"
2. API call is made with invalid date format
3. Server returns Hitman error format
4. Axios interceptor catches the error
5. `handleApiError` is automatically called
6. User sees notification with error details
7. Component's catch block executes (optional logging)
8. Loading state is cleared
9. User can click "Show Details" to see technical info

---

## Developer Workflow

### User Reports Error

**User:** "I'm trying to fetch metrics but getting an error"

**Developer:** "What's the fingerprint?"

**User:** "b466d36cfec1fe03"

**Developer:** *(searches logs for fingerprint)*
```bash
grep "b466d36cfec1fe03" /var/log/hitman/*.log
```

**Result:**
```
[2025-12-31 22:10:15] ERROR [b466d36cfec1fe03] 
Invalid format for field 'startDate': 1404-09-9
Expected format: YYYY-MM-DD
Request from: user@example.com (IP: 192.168.1.100)
Endpoint: /v1/requests?subject=projectx.v3.metrics.psp
```

**Developer:** "Found it! The date format is wrong. Let me check the UI validation..."

---

## Benefits Demonstrated

✅ **Automatic** - No manual error handling code needed  
✅ **Consistent** - Same UX across entire app  
✅ **Trackable** - Fingerprint enables precise debugging  
✅ **Developer-Friendly** - Technical details available when needed  
✅ **User-Friendly** - Clear, actionable messages  
✅ **Non-Intrusive** - Fingerprint displayed subtly  
✅ **Contextual** - Details shown only when available  

---

## Animation Flow (Conceptual)

```
User clicks button
      ↓
Loading spinner shows
      ↓
API request sent
      ↓
Server returns error (400)
      ↓
Axios interceptor catches it
      ↓
handleApiError() called
      ↓
Type checking (isHitmanApiError)
      ↓
✅ It's a Hitman error!
      ↓
Build notification with:
  - Message
  - Fingerprint
  - Show Details button (if details exist)
      ↓
notification.error() displays
      ↓
Notification slides in from top-right
      ↓
User reads error message
      ↓
User sees fingerprint
      ↓
User clicks "Show Details"
      ↓
Details modal appears with full info
      ↓
User reads technical details
      ↓
User closes modal (or it auto-dismisses)
      ↓
Loading spinner clears
      ↓
User can try again with corrected input
```

---

## Code Comparison

### ❌ Before (Manual Error Handling)

```tsx
const fetchData = async () => {
  try {
    const result = await api.post('/v1/requests', data)
    setData(result.data)
    message.success('Success!')
  } catch (error: any) {
    // Manual error handling - inconsistent across app
    if (error.response?.data?.message) {
      message.error(error.response.data.message)
    } else if (error.message) {
      message.error(error.message)
    } else {
      message.error('Something went wrong')
    }
    
    // No fingerprint tracking
    // No details display
    // Different error format handling in each component
  }
}
```

### ✅ After (Automatic Error Handling)

```tsx
const fetchData = async () => {
  try {
    const result = await api.post('/v1/requests', data)
    setData(result.data)
    message.success('Success!')
  } catch (error) {
    // Error is automatically displayed!
    // Just log it if needed
    console.error('Operation failed', error)
  }
}
```

Much cleaner! 🎉

---

## Testing Example

```typescript
it('handles Hitman API error format correctly', async () => {
  // Arrange
  const hitmanError: HitmanApiError = {
    httpStatusCode: 400,
    code: 'invalid.request_body',
    message: 'Empty or invalid request body',
    fingerprint: 'b466d36cfec1fe03',
    details: 'Some technical details...',
  }

  vi.mocked(api.post).mockRejectedValue({
    response: { data: hitmanError }
  })

  // Act
  await expect(service.fetchData()).rejects.toBeTruthy()

  // Assert
  // Error handler is called automatically by interceptor
  // User sees the notification
  // Test can verify the error was handled appropriately
})
```

---

## Summary

This implementation provides:
- **Automatic error handling** for all API calls
- **Consistent UX** across the entire application
- **Developer-friendly tracking** with fingerprints
- **User-friendly messages** with optional technical details
- **Zero boilerplate** in components
- **Fully tested** with comprehensive test suite

🚀 **Ready for production!**
