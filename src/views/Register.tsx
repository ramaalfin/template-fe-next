'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

import { useForm } from 'react-hook-form'

import type { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

import { registerFormSchema } from '@/lib/form-schema'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import LogoAuth from '@/@core/svg/LogoAuth'

const Register = () => {
    // States
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

    // Vars
    const bg = '/images/bg.png'

    // Hooks
    const { settings } = useSettings()

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)
    const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

    // Form
    const form = useForm({
        defaultValues: {
            npwp: '',
            nama: '',
            email: '',
            password: '',
            confirmPassword: '',
            photo: ''
        },
        resolver: zodResolver(registerFormSchema)
    });

    // npwp input mask must be 16 digit
    const npwpInputMask = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const npwp = value.replace(/\D/g, '');

        e.target.value = npwp.slice(0, 16);
    }

    const onSubmit = (val: z.infer<typeof registerFormSchema>) => {
        console.log(val);
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
                <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
                    <div className='flex flex-col gap-1'>
                        <Typography variant='h3' className='font-bold'>Pendaftaran User</Typography>
                        {/* <Typography>Tax Slip</Typography> */}
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" encType='multipart/form-data'>
                            <FormField
                                control={form.control}
                                name="npwp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <CustomTextField autoFocus fullWidth label='NPWP' placeholder='Masukkan NPWP' {...field} onChange={(e) => { npwpInputMask(e); field.onChange(e); }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nama"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <CustomTextField autoFocus fullWidth label='Nama Perusahaan' placeholder='Masukkan Nama Perusahaan' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <CustomTextField autoFocus fullWidth label='Email' placeholder='Masukkan email' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
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
                                        <p className='text-xs italic text-[#B81118]'>*Password harus terdiri dari alfabet, angka, karakter khusus, huruf kecil dan huruf besar</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                                id='outlined-adornment-password'
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

                            {/* photo */}
                            <FormField
                                control={form.control}
                                name="photo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <CustomTextField autoFocus fullWidth label='File Badan/Perorangan' type='file' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button fullWidth variant='contained' type='submit'>Register</Button>
                        </form>

                        <div className='flex justify-center items-center flex-wrap gap-2'>
                            <Typography>Sudah Punya Akun?</Typography>
                            <Link href='/login' className='text-[#FEC400]'>
                                Login
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Register
