# Jibit Developer Panel

A modern React TypeScript application for managing Jibit integrations and API operations.

## 🚀 Tech Stack

- **React 18.3** - Latest React with hooks
- **TypeScript 5.6** - Type safety
- **Vite 5.4** - Lightning fast build tool
- **Ant Design 5.21** - Enterprise UI components
- **Zustand 5.0** - Lightweight state management (3kb)
- **TanStack Query v5** - Server state management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🏗️ Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 🧹 Linting & Type Checking

```bash
npm run lint
npm run type-check
```

## 🌐 API Configuration

The app connects to **https://hitman.jibit.cloud** via a proxy configuration in `vite.config.ts`.

All API calls should use the `/api` prefix, which will be proxied to the Hitman service.

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   └── layout/      # Layout components (AppLayout, etc.)
├── pages/           # Page components
├── services/        # API services and HTTP client
├── stores/          # Zustand state stores
├── App.tsx          # Main App component with routing
├── main.tsx         # App entry point
└── index.css        # Global styles
```

## 🔑 Key Features

- ✅ Modern React 18 with TypeScript
- ✅ Fast development with Vite HMR
- ✅ Ant Design UI components
- ✅ Zustand for lightweight state management
- ✅ TanStack Query for server state caching
- ✅ Axios interceptors for auth & error handling
- ✅ React Router v6 for navigation
- ✅ ESLint + TypeScript strict mode
- ✅ Path aliases (@/*) for clean imports
- ✅ API proxy to Hitman service

## 📝 Notes

- The app uses Vite's proxy to forward `/api/*` requests to `https://hitman.jibit.cloud`
- Authentication tokens are stored in localStorage and automatically added to requests
- Zustand provides a simple, hook-based state management solution
- TanStack Query handles caching, refetching, and loading states for server data

## 🔜 Next Steps

Ready for your additional instructions!
