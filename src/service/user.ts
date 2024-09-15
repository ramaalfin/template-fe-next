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

export const activateUser = async (id_user: string) => {
  const token = getCookie('accessToken')

  try {
    return axios.put(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/activate/${id_user}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error: any) {
    console.error(error)
  }
}

export const getRejectUser = () => {
  const token = getCookie('accessToken')

  try {
    return axios.get(`${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/rejected`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error: any) {
    console.error(error)
  }
}

export const rejectUser = async (id_user: string, keterangan: string) => {
  const token = getCookie('accessToken')

  try {
    return axios.put(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/reject/${id_user}`,
      {
        keterangan
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error: any) {
    console.error(error)
  }
}
