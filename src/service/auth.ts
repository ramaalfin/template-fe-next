import axios from 'axios'

import { getCookie } from 'cookies-next'

interface LoginProps {
  email: string
  password: string
}

interface ChangePasswordProps {
  password: string
  newPassword: string
}

export const login = async ({ email, password }: LoginProps) => {
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

    return response.data
  } catch (error: any) {
    return error.response.data
  }
}

export const logout = async (accessToken: string) => {
  try {
    const response = await axios.post(
      ` ${process.env.NEXT_PUBLIC_APP_API}/v1/auth/logout`,
      {
        accessToken
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data
  } catch (error: any) {
    return error.response.data
  }
}

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(
      ` ${process.env.NEXT_PUBLIC_APP_API}/v1/auth/refresh-tokens`,
      {
        refreshToken
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data
  } catch (error: any) {
    return error.response.data
  }
}

export const changePassword = async ({ password, newPassword }: ChangePasswordProps) => {
  const tokenData = getCookie('token-admin')
  const token = tokenData ? JSON.parse(tokenData) : ''

  try {
    const response = await axios.post(
      ` ${process.env.NEXT_PUBLIC_APP_API}/v1/auth/change-password`,
      {
        password,
        newPassword
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access.token}`
        }
      }
    )

    return response.data
  } catch (error: any) {
    return error.response.data
  }
}
