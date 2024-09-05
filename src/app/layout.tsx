"use client"

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

import { useRouter } from 'next/navigation'

import { IdleTimerProvider } from 'react-idle-timer'

import { deleteCookie } from 'cookies-next'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  const router = useRouter()

  const handleOnIdle = () => {
    // Clear cookies and localStorage on idle
    deleteCookie('accessToken')
    deleteCookie('expires')
    localStorage.removeItem('auth-storage')

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
