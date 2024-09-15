"use client"

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

import { useRouter } from 'next/navigation'

import { IdleTimerProvider } from 'react-idle-timer'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { logout } from '@/service/auth'
import useAuthStore from '@/store/useAuthStore'

import 'react-toastify/dist/ReactToastify.css';

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  const router = useRouter()

  const { token } = useAuthStore()

  const handleOnIdle = () => {
    if (!token) {
      return
    }

    logout({
      refreshToken: token.refresh.token
    })

    useAuthStore.setState({ token: null, user: null })
    localStorage.removeItem('auth-storage')
    document.cookie = 'accessToken=; expires=; path=/;'

    // Redirect to login page
    router.push('/login')
  }

  return (
    <IdleTimerProvider
      timeout={1000 * 60 * 3} // 3 minutes
      onIdle={handleOnIdle}
    >
      <html id='__next' lang='en' dir={direction}>
        <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
      </html>
    </IdleTimerProvider>
  )
}

export default RootLayout
