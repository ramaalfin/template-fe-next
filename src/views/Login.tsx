'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

import { setCookie } from 'cookies-next';

import { Controller, useForm } from 'react-hook-form';

// MUI Imports
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { CircularProgress } from '@mui/material';

// Third-party Imports
import classnames from 'classnames'
import { ToastContainer, toast } from 'react-toastify';
import { AxiosError } from 'axios';

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import CustomTextField from '@/@core/components/mui/TextField';

import { login } from '@/service/auth';

// Custom Hook
import useLoading from '@/hooks/useLoading';

interface LoginProps {
  mode: 'light' | 'dark';
}

interface Login {
  username: string
  password: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoginV2 = ({ mode }: LoginProps) => {
  const { loading, withLoading } = useLoading()
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<Login>({
    defaultValues: {
      username: '',
      password: ''
    }
  })

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit = async (data: Login) => {
    const payload = {
      email: data.username,
      password: data.password
    }

    await withLoading(async () => {
      try {
        const response = await login(payload);

        if (response.code === 200) {
          const userData = response.data.user;
          const tokens = response.data.tokens;

          const { foto, ...userWithoutPhoto } = userData;

          setCookie('user-admin', userWithoutPhoto);

          if (foto) {
            setCookie('photo-admin', foto);
          }

          setCookie('token-admin', tokens);
          router.push('/dashboard_admin');
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
    });
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <img src='/images/illustrations/auth/v2-login-light-border.png' alt='character-illustration' className='w-96' />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <ToastContainer />

        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Welcome to template 👋🏻</Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
          </div>
          <form className="space-y-5">
            <div>
              <Controller
                control={control}
                name="username"
                rules={{ required: 'Username harus diisi' }}
                render={({ field: { onChange } }) => (
                  <CustomTextField
                    fullWidth
                    label='Username'
                    placeholder='Enter your Username'
                    onChange={onChange}
                  />
                )}
              />
              {errors.username && <p className="text-red-500 mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <Controller
                control={control}
                name="password"
                rules={{ required: 'Password harus diisi' }}
                render={({ field: { onChange } }) => (
                  <CustomTextField
                    fullWidth
                    label='Password'
                    type={isPasswordShown ? 'text' : 'password'}
                    placeholder='Enter your password'
                    onChange={onChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                            <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <Button
              fullWidth
              variant='contained'
              type='submit'
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginV2
