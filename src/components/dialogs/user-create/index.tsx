'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { createUserFormSchema } from '@/lib/form-schema'

type UserCreateCardData = {
    badgeColor?: ThemeColor
}

type UserCreateCardProps = {
    open: boolean
    setOpen: (open: boolean) => void
    data?: UserCreateCardData
}

const initialCardData: UserCreateCardProps['data'] = {

    badgeColor: 'primary'
}

const UserCreateCard = ({ open, setOpen, data }: UserCreateCardProps) => {
    // States
    const [cardData, setCardData] = useState(initialCardData)

    const handleClose = () => {
        setOpen(false)
        setCardData(initialCardData)
    }

    // Form
    const form = useForm({
        defaultValues: {
            npwp: '',
            nama: '',
            email: '',
            photo: ''
        },
        resolver: zodResolver(createUserFormSchema)
    });

    // npwp input mask must be 16 digit
    const npwpInputMask = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const npwp = value.replace(/\D/g, '');

        e.target.value = npwp.slice(0, 16);
    }

    const onSubmit = (val: z.infer<typeof createUserFormSchema>) => {
        console.log(val);
    }

    useEffect(() => {
        setCardData(data ?? initialCardData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
            <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
                <i className='tabler-x' />
            </DialogCloseButton>
            <DialogTitle variant='h4' className='p-6 sm:pbs-16 sm:pbe-6 sm:pli-16'>
                User
                <Typography component='span' className='flex flex-col'>
                    Create New
                </Typography>
            </DialogTitle>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <DialogContent className='overflow-visible pbs-0 p-6 sm:pli-16 space-y-1'>
                        <Grid container spacing={6}>
                            <Grid item xs={6}>
                                <Typography variant='h6' className='mb-4'>
                                    NPWP
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <FormField
                                    control={form.control}
                                    name="npwp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <CustomTextField autoFocus fullWidth placeholder='Enter your NPWP' {...field} onChange={(e) => { npwpInputMask(e); field.onChange(e); }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={6}>
                            <Grid item xs={6}>
                                <Typography variant='h6' className='mb-4'>
                                    Nama
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <FormField
                                    control={form.control}
                                    name="nama"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <CustomTextField autoFocus fullWidth placeholder='Enter your Nama' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={6}>
                            <Grid item xs={6}>
                                <Typography variant='h6' className='mb-4'>
                                    Email
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <CustomTextField autoFocus fullWidth placeholder='Enter your email or username' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={6}>
                            <Grid item xs={6}>
                                <Typography variant='h6' className='mb-4'>
                                    File Badan/Perorangan
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <FormField
                                    control={form.control}
                                    name="photo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <CustomTextField autoFocus fullWidth type='file' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions className='flex justify-start pbs-0 p-6 sm:pbe-16 sm:pli-16'>
                        <Button variant='contained' type='submit'>
                            Simpan
                        </Button>
                    </DialogActions>
                </form>
            </Form>
        </Dialog>
    )
}

export default UserCreateCard
