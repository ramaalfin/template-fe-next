'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

import Link from 'next/link'

import { useForm } from 'react-hook-form';

// MUI Imports
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'
import type { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { loginFormSchema } from '@/lib/form-schema';

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import CustomTextField from '@/@core/components/mui/TextField';

import { login } from '@/service/auth';
import useAuthStore from '@/store/useAuthStore';
import LogoAuth from '@/@core/svg/LogoAuth';

const LoginV2 = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Vars
  const bg = '/images/bg.png'

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  // Form
  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(loginFormSchema)
  });

  const onSubmit = (val: z.infer<typeof loginFormSchema>) => {
    login(val, (success, response) => {

      if (success && response && response.code === 200) {
        setUser(response.data.user);
        setToken(response.data.tokens);

        router.push('/dashboard_admin');
      } else if (response && response.code === 401) {
        alert(response.message);
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
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
        }}
      >
        <LogoAuth />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Welcome to <span className='text-[#B81118]'>BJBSyariah</span> 👋🏻</Typography>
            <Typography>Mitra Amanah Usaha Maslahah</Typography>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomTextField autoFocus fullWidth label='Email' placeholder='Masukkan email' {...field} />
                    </FormControl >
                    <FormMessage />
                  </FormItem >
                )}
              />

              < FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomTextField
                        fullWidth
                        label='Password'
                        placeholder='············'
                        id='outlined-adornment-password'
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

              <Button fullWidth variant='contained' type='submit' > Login</Button>
            </form >
          </Form >
        </div >
      </div >
    </div >
  )
}

export default LoginV2
