import axios from 'axios'

import { getCookie } from 'cookies-next'

export const getInactiveUser = () => {
  const token = getCookie('accessToken')

  try {
    return axios.get(`${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/inactive`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error: any) {
    console.error(error)
  }
}

export const getActiveUser = () => {
  const token = getCookie('accessToken')

  try {
    return axios.get(`${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/active`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error: any) {
    console.error(error)
  }
}
