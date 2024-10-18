import axios from 'axios'

import { getCookie } from 'cookies-next'

export const menuByRoles = async (callback: (success: boolean, data: any) => void) => {
  const tokenData = getCookie('token-admin')
  const token = tokenData ? JSON.parse(tokenData) : ''

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API}/v1/sys/menus/by-role`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.access.token}`
      }
    })

    callback(true, response.data)
  } catch (error: any) {
    callback(false, 'Something went wrong')
  }
}
