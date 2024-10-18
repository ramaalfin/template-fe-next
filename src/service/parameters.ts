import axios from 'axios'

import { getCookie } from 'cookies-next'

interface CreateParameterProps {
  parameter: string
  deskripsi: string
  nilai: string
  nilai_html: string
}

interface UpdateParameterProps {
  id_parameter: string
  parameter: string
  deskripsi: string
  nilai: string
  nilai_html: string
}

export const getAllParameters = (page: number, limit: number, sortBy: string, sortType: string) => {
  const tokenData = getCookie('token-admin')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token.access.token

  try {
    return axios.get(
      `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/parameters?page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`,
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

export const createParameter = async ({ parameter, deskripsi, nilai, nilai_html }: CreateParameterProps) => {
  const tokenData = getCookie('token-admin')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token.access.token

  try {
    const data = {
      parameter: parameter,
      deskripsi: deskripsi,
      nilai: nilai,
      nilai_html: nilai_html
    }

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: ` ${process.env.NEXT_PUBLIC_APP_API}/v1/sys/parameters`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      data: data
    }

    const response = await axios
      .request(config)
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })

    return response
  } catch (error: any) {
    return error.response.data
  }
}

export const getParameterById = async (id_parameter: string) => {
  const tokenData = getCookie('token-admin')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token.access.token

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API}/v1/sys/parameters/${id_parameter}`, {
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

export const updateParameter = async ({
  parameter,
  deskripsi,
  nilai,
  nilai_html,
  id_parameter
}: UpdateParameterProps) => {
  const tokenData = getCookie('token-admin')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token.access.token

  try {
    const data = {
      parameter: parameter,
      deskripsi: deskripsi,
      nilai: nilai,
      nilai_html: nilai_html
    }

    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_APP_API}/v1/sys/parameters/${id_parameter}`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      data: data
    }

    const response = await axios
      .request(config)
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })

    return response
  } catch (error: any) {
    return error.response.data
  }
}

export const deleteParameter = async (id_parameter: string) => {
  const tokenData = getCookie('token-admin')
  const token = tokenData ? JSON.parse(tokenData) : ''
  const accessToken = token.access.token

  try {
    return axios.delete(`${process.env.NEXT_PUBLIC_APP_API}/v1/sys/parameters/${id_parameter}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    return error.response.data
  }
}
