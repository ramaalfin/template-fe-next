import axios from 'axios'
import { getCookie } from 'cookies-next'

export const getFile = async (file_badan: string) => {
  const token = getCookie('accessToken')

  return axios.get(`${process.env.NEXT_PUBLIC_APP_API}/v1/file/${file_badan}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}
