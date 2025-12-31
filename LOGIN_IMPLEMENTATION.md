# Login Implementation - Token-Based Authentication

## Overview
Implemented a token-based authentication system for the Jibit Developer Panel that verifies tokens against the Hitman API and manages permission-based access control.

## Features Implemented

### 1. Token-Based Login Page
- **Location**: `src/pages/LoginPage.tsx`
- **Functionality**:
  - Single token input field (not username/password)
  - Verifies token via POST request to `https://hitman.jibit.cloud/v1/tokens`
  - Validates that token is active
  - Shows error messages for invalid or inactive tokens
  - Beautiful gradient background with centered card layout

### 2. Authentication Service
- **Location**: `src/services/authService.ts`
- **API Integration**:
  ```typescript
  POST https://hitman.jibit.cloud/v1/tokens
  Headers:
    - Accept: application/json
    - Accept-Language: fa
    - Content-Type: application/json
  Body: { "token": "{{hitman_token}}" }
  ```
- **Response Structure**:
  ```typescript
  {
    username: string
    token: string
    active: boolean
    permissions: string[]
    createdAt: string
    modifiedAt: string
  }
  ```

### 3. Updated Auth Store
- **Location**: `src/stores/useAuthStore.ts`
- **New Features**:
  - Stores user data including permissions array
  - `hasPermission(prefix)` - Check if user has any permission starting with prefix
  - `hasAnyPermission(prefixes[])` - Check if user has any permission starting with any of the prefixes
  - Persists authentication state to localStorage

### 4. Protected Routes
- **Location**: `src/components/ProtectedRoute.tsx`
- Redirects unauthenticated users to `/login`
- Wraps all authenticated routes in the app

### 5. Permission-Based Menu System
- **Location**: `src/components/layout/AppLayout.tsx`
- **Dynamic Menu Items**:
  - **Home**: Always visible (Dashboard, App Properties)
  - **ProjectX**: Visible if any permission starts with `"projectx"`
  - **Agents**: Visible if any permission starts with `"saman"`, `"sepehr"`, `"behpardakht"`, or `"ap"`
  - **Ledger**: Visible if any permission starts with `"yal"`

### 6. User Menu with Logout
- Displays username in header with dropdown menu
- Logout functionality that clears auth state and redirects to login

### 7. Updated API Service
- **Location**: `src/services/api.ts`
- Base URL changed to `https://hitman.jibit.cloud`
- Added required headers: `Accept`, `Accept-Language`, `Content-Type`
- Automatic token injection from localStorage
- 401 error handling with redirect to login

### 8. New Routes
- `/login` - Login page (public)
- `/ledger/transactions` - Ledger transactions page (protected, requires "yal" permission)
- `/ledger/accounts` - Ledger accounts page (protected, requires "yal" permission)

## Files Created
1. `src/pages/LoginPage.tsx` - Token-based login page
2. `src/services/authService.ts` - Token verification service
3. `src/components/ProtectedRoute.tsx` - Route protection component
4. `src/pages/ledger/TransactionsPage.tsx` - Ledger transactions page
5. `src/pages/ledger/AccountsPage.tsx` - Ledger accounts page

## Files Modified
1. `src/stores/useAuthStore.ts` - Enhanced with permissions and helper methods
2. `src/services/api.ts` - Updated base URL and headers
3. `src/App.tsx` - Added login route and protected routes
4. `src/components/layout/AppLayout.tsx` - Permission-based menu and user dropdown
5. `src/main.tsx` - Removed dev tool imports that were causing build issues
6. `tsconfig.json` - Added exclude for dev folder

## Permission Mapping

| Section   | Required Permission Prefix                     |
|-----------|-----------------------------------------------|
| Home      | Always visible                                 |
| ProjectX  | `projectx`                                    |
| Agents    | `saman`, `sepehr`, `behpardakht`, or `ap`    |
| Ledger    | `yal`                                         |

## Example Permissions
Based on the example response:
```json
{
  "permissions": [
    "projectx.v3.>",
    "yal.v1.transactions.inquiry",
    "yal.v1.transactions.create",
    "saman.ipg.v1.>",
    "yal.v1.accounts.create",
    "sepehr.ipg.v1.>"
  ]
}
```

User would see:
- ✅ Home (always visible)
- ✅ ProjectX (has `projectx.v3.>`)
- ✅ Agents (has `saman.ipg.v1.>` and `sepehr.ipg.v1.>`)
- ✅ Ledger (has multiple `yal.v1.*` permissions)

## Testing
1. Navigate to `http://localhost:3001/`
2. Should redirect to `/login`
3. Enter your Hitman token
4. Upon successful verification:
   - Redirected to home page
   - See username in header
   - Menu items visible based on permissions
5. Click logout to clear session

## Development Server
```bash
npm run dev
```
Server runs at: `http://localhost:3001/` (or next available port)

## Type Check
```bash
npm run type-check
```
All TypeScript compilation errors resolved.

## Build
```bash
npm run build
```
Production build ready.

---

**Author**: Younes Rahimi  
**Date**: December 31, 2025
