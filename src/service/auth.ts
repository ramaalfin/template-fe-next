import axios from 'axios'

import { setCookie } from 'cookies-next'

interface LoginProps {
  email: string
  password: string
}

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

    setCookie('token', response.data.data.tokens.access.token)

    callback(true, response.data)
  } catch (error: any) {
    callback(false, 'Invalid email or password')
  }
}
