import axios from 'axios'

import { getCookie } from 'cookies-next'

interface CreateUserProps {
  npwp: string
  nama: string
  email: string
  password: string
  file: any
}

interface UpdateUserProps {
  id_user: string
  npwp: string
  nama: string
  password: string
  file: any
}

export const getInactiveUser = (page: number, limit: number, sortBy: string, sortType: string) => {
  const tokenData = getCookie('token-client')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token?.access?.token

  try {
    return axios.get(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/inactive?page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
  } catch (error: any) {
    return error.response.data
  }
}

export const getActiveUser = (page: number, limit: number, sortBy: string, sortType: string) => {
  const tokenData = getCookie('token-client')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token?.access?.token

  try {
    return axios.get(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/active?page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
  } catch (error: any) {
    return error.response.data
  }
}

export const activateUser = async (id_user: string) => {
  const tokenData = getCookie('token-client')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token?.access?.token

  try {
    return axios.put(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/activate/${id_user}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error: any) {
    return error.response.data
  }
}

export const getRejectUser = (page: number, limit: number, sortBy: string, sortType: string) => {
  const tokenData = getCookie('token-client')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token?.access?.token

  try {
    return axios.get(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/rejected?page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
  } catch (error: any) {
    return error.response.data
  }
}

export const rejectUser = async (id_user: string, keterangan: string) => {
  const tokenData = getCookie('token-client')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token?.access?.token

  try {
    return axios.put(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/reject/${id_user}`,
      {
        keterangan
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error: any) {
    return error.response.data
  }
}

export const createUser = async ({ npwp, nama, email, password, file }: CreateUserProps) => {
  const tokenData = getCookie('token-client')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token?.access?.token

  try {
    const form = new FormData()

    form.append('email', email)
    form.append('password', password)
    form.append('nama', nama)
    form.append('npwp', npwp)
    form.append('file', file)

    const response = await axios.post(` ${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users`, form, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error: any) {
    return error.response.data
  }
}

export const getUserById = async (id_user: string) => {
  const tokenData = getCookie('token-client')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token?.access?.token

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/${id_user}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    return error.response.data
  }
}

export const updateUser = async ({ npwp, nama, password, file, id_user }: UpdateUserProps) => {
  const tokenData = getCookie('token-client')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token?.access?.token

  try {
    const form = new FormData()

    if (npwp) {
      form.append('npwp', npwp)
    }

    if (nama) {
      form.append('nama', nama)
    }

    if (password) {
      form.append('password', password)
    }

    if (file) {
      form.append('file', file)
    }

    const response = await axios.put(`${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/${id_user}`, form, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error: any) {
    return error.response.data
  }
}

export const deleteUser = async (id_user: string) => {
  const tokenData = getCookie('token-client')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token?.access?.token

  try {
    return axios.delete(`${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/${id_user}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    return error.response.data
  }
}

export const logoutUser = async (id_user: string) => {
  const tokenData = getCookie('token-client')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token?.access?.token

  try {
    return axios.post(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/users/force-logout/${id_user}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error: any) {
    return error.response.data
  }
}
