import axios from 'axios'

import { getCookie, setCookie } from 'cookies-next'

interface LoginProps {
  email: string
  password: string
}

const setTokens = (accessToken: string, refreshToken: string, expires: string): void => {
  setCookie('accessToken', accessToken)
  setCookie('refreshToken', refreshToken)
  setCookie('expires', expires)
}

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/auth/refresh-tokens`,
      {
        refresh_token: refreshToken
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`
        }
      }
    )

    // Update access token dan expiry time
    setTokens(
      response.data.tokens.access.token,
      response.data.tokens.refresh.token,
      new Date(response.data.tokens.access.expires).toString()
    )

    return response.data.tokens.access.token
  } catch (error) {
    console.error('Failed to refresh access token:', error)
    throw error
  }
}

axios.interceptors.request.use(
  async config => {
    let accessToken = getCookie('accessToken')
    const expires = new Date(getCookie('expires'))

    if (new Date() >= expires) {
      // Token sudah kadaluarsa, refresh token
      accessToken = await refreshAccessToken()
    }

    // Set authorization header
    config.headers.Authorization = `Bearer ${accessToken}`

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export const login = async ({ email, password }: LoginProps, callback: (success: boolean, data: any) => void) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/auth/login`,
      {
        email,
        password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    setTokens(
      response.data.data.tokens.access.token,
      response.data.data.tokens.refresh.token,
      new Date(response.data.data.tokens.access.expires).toString()
    )

    callback(true, response.data)
  } catch (error: any) {
    callback(false, 'Invalid email or password')
  }
}
