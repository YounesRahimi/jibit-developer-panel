# Quick Start Guide

## Getting Started

### 1. Install Dependencies (Already Done ✅)
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
App will be available at: http://localhost:3000

### 3. Project Structure Overview

```
src/
├── App.tsx                    # Routes definition
├── main.tsx                   # App bootstrap with providers
├── components/layout/         # Layout components
├── pages/                     # Page components
├── services/api.ts           # Axios HTTP client
└── stores/useAuthStore.ts    # Auth state management
```

## Adding a New Page

### 1. Create the page component
```tsx
// src/pages/MyNewPage.tsx
import { Typography } from 'antd'

const { Title } = Typography

const MyNewPage = () => {
  return (
    <div>
      <Title level={2}>My New Page</Title>
      <p>Content goes here</p>
    </div>
  )
}

export default MyNewPage
```

### 2. Add route in App.tsx
```tsx
import MyNewPage from './pages/MyNewPage'

// Add inside the Routes:
<Route path="/my-page" element={<MyNewPage />} />
```

### 3. Add menu item in AppLayout.tsx
```tsx
const menuItems = [
  // ...existing items
  {
    key: '/my-page',
    icon: <YourIcon />,
    label: 'My Page',
  },
]
```

## Making API Calls

### Using the Axios client directly
```tsx
import api from '@/services/api'

const fetchData = async () => {
  const response = await api.get('/endpoint')
  return response.data
}
```

### Using TanStack Query (Recommended)
```tsx
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

const MyComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myData'],
    queryFn: async () => {
      const response = await api.get('/endpoint')
      return response.data
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>{data}</div>
}
```

## State Management

### Using Zustand
```tsx
// Create a store
import { create } from 'zustand'

interface MyStore {
  count: number
  increment: () => void
}

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))

// Use in component
const MyComponent = () => {
  const { count, increment } = useMyStore()
  return <button onClick={increment}>Count: {count}</button>
}
```

## Using Ant Design Components

```tsx
import { Button, Card, Space, message } from 'antd'

const MyComponent = () => {
  const handleClick = () => {
    message.success('Success!')
  }

  return (
    <Space direction="vertical">
      <Card title="My Card">
        <Button type="primary" onClick={handleClick}>
          Click Me
        </Button>
      </Card>
    </Space>
  )
}
```

## Environment Variables

Create `.env` file:
```env
VITE_API_BASE_URL=https://hitman.jibit.cloud
VITE_APP_NAME=Jibit Developer Panel
```

Access in code:
```tsx
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
npm run type-check   # Check TypeScript types
```

## Tips

1. **Hot Module Replacement (HMR)**: Changes appear instantly without full reload
2. **TypeScript**: Use interfaces for props and types
3. **Code Splitting**: Use React.lazy() for route-based code splitting
4. **API Proxy**: All `/api/*` requests are proxied to hitman.jibit.cloud
5. **Ant Design**: Browse components at https://ant.design/components/overview/

## Need Help?

- [React Docs](https://react.dev)
- [Ant Design Docs](https://ant.design)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Vite Docs](https://vitejs.dev)
