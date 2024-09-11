import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: any
  token: any
  setUser: (user: any) => void
  setToken: (token: any) => void
}

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      setUser: user => set(state => ({ ...state, user })),
      setToken: token => set(state => ({ ...state, token }))
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage
    }
  )
)

export default useAuthStore
