import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface User {
  username: string
  token: string
  active: boolean
  permissions: string[]
  createdAt: string
  modifiedAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  permissions: string[]
  login: (user: User) => void
  logout: () => void
  hasPermission: (prefix: string) => boolean
  hasAnyPermission: (prefixes: string[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      permissions: [],
      login: (user) => {
        localStorage.setItem('token', user.token)
        set({
          user,
          token: user.token,
          isAuthenticated: true,
          permissions: user.permissions
        })
      },
      logout: () => {
        localStorage.removeItem('token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          permissions: []
        })
      },
      hasPermission: (prefix) => {
        const { permissions } = get()
        return permissions.some(p => p.startsWith(prefix))
      },
      hasAnyPermission: (prefixes) => {
        const { permissions } = get()
        return prefixes.some(prefix =>
          permissions.some(p => p.startsWith(prefix))
        )
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
