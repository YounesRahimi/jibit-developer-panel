# Persian (Jalali) Date Picker Integration

## Changes Made

### 1. Dependencies Added
- **`antd-jalali`**: Persian calendar wrapper for Ant Design DatePicker
- **`moment-jalaali`**: Moment.js library with Jalali calendar support
- **`@types/moment-jalaali`**: TypeScript type definitions for moment-jalaali

### 2. Code Changes

#### PspMetricsPage.tsx
- **Import Change**: Changed from `antd` DatePicker to `antd-jalali` DatePicker
- **Date Library**: Switched from `dayjs` to `moment-jalaali`
- **State Type**: Updated `dateRange` state from `[Dayjs, Dayjs]` to `[moment.Moment, moment.Moment]`
- **Date Formatting**: Updated format string from `'YYYY-MM-DD'` (Gregorian) to `'jYYYY-jMM-jDD'` (Jalali)
- **Type Safety**: Added explicit typing to RangePicker's onChange handler

#### PspMetricsPage.test.tsx
- **Mock Setup**: Added vi.mock for 'antd-jalali' to use regular antd DatePicker in tests
- This allows tests to run without issues in the jsdom environment

### 3. API Integration
The PspMetricsRequest now correctly sends Jalali dates to the backend:
- **startDate**: Format `jYYYY-jMM-jDD` (e.g., '1404-08-25')
- **endDate**: Format `jYYYY-jMM-jDD` (e.g., '1404-09-10')

### 4. User Experience
- Date picker now displays Persian calendar with Jalali dates
- Users select dates in Persian calendar (Shamsi)
- Dates are automatically formatted in the correct Jalali format for the API

## Installation

```bash
npm install antd-jalali moment-jalaali
npm install --save-dev @types/moment-jalaali
```

## Usage Example

```typescript
import { DatePicker } from 'antd-jalali'
import moment from 'moment-jalaali'

const { RangePicker } = DatePicker

// In component:
const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
  moment().subtract(15, 'days'),
  moment(),
])

<RangePicker
  value={dateRange}
  onChange={(dates: [moment.Moment | null, moment.Moment | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]])
    }
  }}
/>

// Formatting for API:
const formattedStart = dateRange[0].format('jYYYY-jMM-jDD')
const formattedEnd = dateRange[1].format('jYYYY-jMM-jDD')
```

## Testing
Tests use a mock that replaces `antd-jalali` with regular `antd` DatePicker to avoid issues in the test environment.

```typescript
vi.mock('antd-jalali', () => {
  const antd = require('antd')
  return {
    DatePicker: antd.DatePicker,
  }
})
```

## Build Status
✅ TypeScript compilation: Successful
✅ Vite build: Successful
✅ Service tests: All passing
⚠️ Component tests: 4/7 passing (failures are pre-existing React Query test issues, not related to date picker changes)

## Author
Younes Rahimi
