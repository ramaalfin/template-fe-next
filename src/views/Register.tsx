'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

import { useForm } from 'react-hook-form'

import type { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

import { registerFormSchema } from '@/lib/form-schema'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'


// Styled Custom Components
const RegisterIllustration = styled('img')(({ theme }) => ({
    zIndex: 2,
    blockSize: 'auto',
    maxBlockSize: 600,
    maxInlineSize: '100%',
    margin: theme.spacing(12),
    [theme.breakpoints.down(1536)]: {
        maxBlockSize: 550
    },
    [theme.breakpoints.down('lg')]: {
        maxBlockSize: 450
    }
}))

const MaskImg = styled('img')({
    blockSize: 'auto',
    maxBlockSize: 345,
    inlineSize: '100%',
    position: 'absolute',
    insetBlockEnd: 0,
    zIndex: -1
})

const Register = ({ mode }: { mode: SystemMode }) => {
    // States
    const [isPasswordShown, setIsPasswordShown] = useState(false)

    // Vars
    const darkImg = '/images/pages/auth-mask-dark.png'
    const lightImg = '/images/pages/auth-mask-light.png'
    const darkIllustration = '/images/illustrations/auth/v2-register-dark.png'
    const lightIllustration = '/images/illustrations/auth/v2-register-light.png'
    const borderedDarkIllustration = '/images/illustrations/auth/v2-register-dark-border.png'
    const borderedLightIllustration = '/images/illustrations/auth/v2-register-light-border.png'

    // Hooks
    const { settings } = useSettings()
    const theme = useTheme()
    const hidden = useMediaQuery(theme.breakpoints.down('md'))
    const authBackground = useImageVariant(mode, lightImg, darkImg)

    const characterIllustration = useImageVariant(
        mode,
        lightIllustration,
        darkIllustration,
        borderedLightIllustration,
        borderedDarkIllustration
    )

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)

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
        // login(val, (success, response) => {

        //     if (success && response && response.code === 200) {
        //         setUser(response.data.user);
        //         setToken(response.data.tokens);

        //         router.push('/login');
        //     } else if (response && response.code === 401) {
        //         alert(response.message);
        //     }
        // });
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
            >
                <RegisterIllustration src={characterIllustration} alt='character-illustration' />
                {!hidden && <MaskImg alt='mask' src={authBackground} />}
            </div>
            <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
                <Link
                    href='/login'
                    className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
                >
                    <Logo />
                </Link>
                <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
                    <div className='flex flex-col gap-1'>
                        <Typography variant='h4'>Adventure starts here 🚀</Typography>
                        <Typography>Make your app management easy and fun!</Typography>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" encType='multipart/form-data'>
                            <FormField
                                control={form.control}
                                name="npwp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <CustomTextField autoFocus fullWidth label='NPWP' placeholder='Enter your NPWP' {...field} onChange={(e) => { npwpInputMask(e); field.onChange(e); }} />
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
                                            <CustomTextField autoFocus fullWidth label='Nama' placeholder='Enter your Nama' {...field} />
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
                                            <CustomTextField autoFocus fullWidth label='Email' placeholder='Enter your email or username' {...field} />
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
                            <Typography>Already have an account?</Typography>
                            <Link href='/login' color='primary'>
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
