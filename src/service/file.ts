import axios from 'axios'
import { getCookie } from 'cookies-next'

export const getFile = async (file_badan: string) => {
  const tokenData = getCookie('token-admin')
  const token = tokenData ? JSON.parse(tokenData) : ''

  return axios.get(`${process.env.NEXT_PUBLIC_APP_API}/v1/file/${file_badan}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.access.token}`
    }
  })
}
