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

type RejectUserCardData = {
    badgeColor?: ThemeColor
}

type RejectUserCardProps = {
    open: boolean
    setOpen: (open: boolean) => void
    data?: RejectUserCardData
}

const initialCardData: RejectUserCardProps['data'] = {

    badgeColor: 'primary'
}

const RejectUserCard = ({ open, setOpen, data }: RejectUserCardProps) => {
    // States
    const [cardData, setCardData] = useState(initialCardData)

    const handleClose = () => {
        setOpen(false)
        setCardData(initialCardData)
    }

    // Form
    const form = useForm({
        defaultValues: {
            alasan: '',
        },
    });

    const onSubmit = (val: any) => {
        console.log(val);
    }

    useEffect(() => {
        setCardData(data ?? initialCardData)
    }, [open])

    return (
        <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
            <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
                <i className='tabler-x' />
            </DialogCloseButton>
            <DialogTitle variant='h4' className='p-6 sm:pbs-8 sm:pbe-6 sm:pli-8 text-center'>
                Apakah anda yakin ingin mereject user ini?
            </DialogTitle>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <DialogContent className='overflow-visible pbs-0 p-6 sm:pli-16 space-y-1'>
                        <Grid item xs={12}>
                            <FormField
                                control={form.control}
                                name="alasan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            {/* textarea */}
                                            <CustomTextField
                                                autoFocus
                                                fullWidth
                                                multiline
                                                rows={4}
                                                placeholder='Masukkan alasan penolakan'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </Grid>
                    </DialogContent>
                    <DialogActions className='flex justify-center pbs-0 p-6 sm:pbe-8 sm:pli-8'>
                        <Button variant='contained' type='submit'>
                            Simpan
                        </Button>
                        <Button variant='outlined' onClick={handleClose}>
                            Batal
                        </Button>
                    </DialogActions>
                </form>
            </Form>
        </Dialog>
    )
}

export default RejectUserCard
