import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: any
  token: any
  setUser: (user: any) => void
  setToken: (token: any) => void
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      setUser: user => set(state => ({ ...state, user })),
      setToken: token => set(state => ({ ...state, token })),
      logout: () => {
        set({ user: null, token: '' })
        localStorage.removeItem('auth-storage')
        document.cookie = 'accessToken=; expires=; refreshToken=; path=/'
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage
    }
  )
)

export default useAuthStore
