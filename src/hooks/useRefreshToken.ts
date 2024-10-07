import { getCookie, setCookie } from 'cookies-next'

import { refreshToken } from '@/service/auth'

export async function useRefreshToken() {
  const tokenData = getCookie('token-client')
  const token = tokenData ? JSON.parse(tokenData) : null

  if (!token?.refresh?.token) return null

  const refresh = await refreshToken(token.refresh.token)

  if (refresh.code === 200) {
    setCookie(
      'token-client',
      JSON.stringify({
        access: { token: refresh.data.access.token, expires: refresh.data.access.expires },
        refresh: { token: refresh.data.refresh.token, expires: refresh.data.refresh.expires }
      })
    )

    return true
  }

  return false
}
