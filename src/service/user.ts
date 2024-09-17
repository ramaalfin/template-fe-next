import axios from 'axios'

import { getCookie } from 'cookies-next'

interface CreateUserProps {
  npwp: string
  nama: string
  email: string
  password: string
  file: any
}

export const getInactiveUser = (page: number, limit: number, sortBy: string, sortType: string) => {
  const token = getCookie('accessToken')

  try {
    return axios.get(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/inactive?page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
  } catch (error: any) {
    return error.response.data
  }
}

export const getActiveUser = (page: number, limit: number, sortBy: string, sortType: string) => {
  const token = getCookie('accessToken')

  try {
    return axios.get(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/active?page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
  } catch (error: any) {
    return error.response.data
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
    return error.response.data
  }
}

export const getRejectUser = (page: number, limit: number, sortBy: string, sortType: string) => {
  const token = getCookie('accessToken')

  try {
    return axios.get(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/rejected?page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
  } catch (error: any) {
    return error.response.data
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
    return error.response.data
  }
}

export const createUser = async ({ npwp, nama, email, password, file }: CreateUserProps) => {
  const token = getCookie('accessToken')

  try {
    const form = new FormData()

    form.append('email', email)
    form.append('password', password)
    form.append('nama', nama)
    form.append('npwp', npwp)
    form.append('file', file)

    const response = await axios.post(` ${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error: any) {
    return error.response.data
  }
}
