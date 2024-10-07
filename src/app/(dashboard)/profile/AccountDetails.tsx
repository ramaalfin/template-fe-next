'use client'

// React Imports
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AxiosError } from 'axios'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { IconButton, InputAdornment } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import { deleteCookie, getCookie } from 'cookies-next'

import { profileFormSchema } from '@/lib/form-schema'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { changePassword, logout } from '@/service/auth'

const AccountDetails = () => {
  // States
  const router = useRouter()
  const userData = getCookie('user-client')
  const tokenData = getCookie('token-client')
  const user = userData ? JSON.parse(userData as string) : null
  const token = tokenData ? JSON.parse(tokenData as string) : null
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowNewPassword = () => setIsNewPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const form = useForm({
    defaultValues: {
      npwp: user?.npwp || '',
      nama: user?.nama || '',
      email: user?.email || '',
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: zodResolver(profileFormSchema)
  });

  // npwp input mask must be 16 digit
  const npwpInputMask = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const npwp = value.replace(/\D/g, '');

    e.target.value = npwp.slice(0, 16);
  }

  const onSubmit = async (val: z.infer<typeof profileFormSchema>) => {
    try {
      const response = await changePassword({
        password: val.password,
        newPassword: val.newPassword,
      });

      if (response.code === 200) {
        form.reset();

        toast.success("Password berhasil diubah, silahkan login kembali menggunakan password baru");

        const res = await logout(token?.access.token);

        setTimeout(() => {
          if (res && res?.code === 200) {
            deleteCookie('user-client');
            deleteCookie('token-client');

            router.push('/login');
          }
        }, 2000);
      } else {
        toast.error(response.message);
      }

    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("Gagal menghubungkan ke server");
      } else {
        toast.error('Terjadi kesalahan');
      }
    }
  }

  return (
    <>
      <ToastContainer />

      {user?.pwd.is_expired && (
        <p className="p-4 bg-primary text-white mb-4 rounded-md w-fit font-bold text-[16px]">
          Password Anda sudah kadaluarsa, silahkan ganti password
        </p>
      )}

      {user?.pwd.is_first && (
        <p className="p-4 bg-primary text-white mb-4 rounded-md w-fit font-bold text-[16px]">
          Password Anda masih default, silahkan ganti password
        </p>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <FormField
                    control={form.control}
                    name="npwp"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomTextField fullWidth disabled label='NPWP' {...field} onChange={(e) => { npwpInputMask(e); field.onChange(e); }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomTextField
                            fullWidth
                            label='Password Lama'
                            placeholder='············'
                            type={isPasswordShown ? 'text' : 'password'}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                                    <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomTextField fullWidth label='Email' disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomTextField
                            fullWidth
                            label='Password Baru'
                            placeholder='············'
                            type={isNewPasswordShown ? 'text' : 'password'}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton edge='end' onClick={handleClickShowNewPassword} onMouseDown={e => e.preventDefault()}>
                                    <i className={isNewPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            {...field}
                          />
                        </FormControl>

                        <p className='text-xs italic text-[#B81118]'>*Password harus terdiri dari alfabet, angka, karakter khusus, huruf kecil dan huruf besar</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomTextField fullWidth label='Nama Perusahaan' disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomTextField
                            fullWidth
                            label='Konfirmasi Password'
                            placeholder='············'
                            type={isConfirmPasswordShown ? 'text' : 'password'}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton edge='end' onClick={handleClickShowConfirmPassword} onMouseDown={e => e.preventDefault()}>
                                    <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Grid>
                <Grid item xs={12} className='flex gap-4 flex-wrap'>
                  <Button variant='contained' type='submit'>
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  )
}

export default AccountDetails
