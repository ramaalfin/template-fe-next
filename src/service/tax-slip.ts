import axios from 'axios'
import { getCookie } from 'cookies-next'

export const getAllTaxSlip = () => {
  const token = getCookie('accessToken')

  try {
    return axios.get(`${process.env.NEXT_PUBLIC_APP_API}/v1/mst/tax-slip`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error: any) {
    console.error(error)
  }
}

export const downloadTaxSlip = async (file_tax_slip: string) => {
  const token = getCookie('accessToken')

  return axios.get(`${process.env.NEXT_PUBLIC_APP_API}/v1/mst/tax-slip/download/${file_tax_slip}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

export const uploadTaxSlip = async (data: FormData) => {
  const token = getCookie('accessToken')

  try {
    return axios.post(`${process.env.NEXT_PUBLIC_APP_API}/v1/mst/tax-slip/upload`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
  } catch (error: any) {
    console.error(error)
  }
}
