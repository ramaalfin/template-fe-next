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
import { CircularProgress } from '@mui/material'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { toast } from 'react-toastify'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { rejectUser } from '@/service/user'
import { rejectUserFormSchema } from '@/lib/form-schema'

// Custom Hook
import useLoading from '@/hooks/useLoading'

type RejectUserCardData = {
    badgeColor?: ThemeColor
}

type RejectUserCardProps = {
    open: boolean
    setOpen: (open: boolean) => void
    data?: RejectUserCardData
    id_user: string
    nama: string
    npwp: string
}

const initialCardData: RejectUserCardProps['data'] = {

    badgeColor: 'primary'
}

const RejectUserCard = ({ open, setOpen, data, id_user, nama, npwp }: RejectUserCardProps) => {
    const { loading, withLoading } = useLoading()

    // States
    const [cardData, setCardData] = useState(initialCardData)
    const [charCount, setCharCount] = useState(0)

    const handleClose = () => {
        setOpen(false)
        setCardData(initialCardData)
    }

    // Form
    const form = useForm({
        defaultValues: {
            keterangan: '',
        },

        resolver: zodResolver(rejectUserFormSchema)
    });

    const onSubmit = async (val: z.infer<typeof rejectUserFormSchema>) => {
        await withLoading(async () => {
            const response = await rejectUser(id_user, val.keterangan)

            if (response && response.data.code === 200) {
                setOpen(false)
                window.location.reload()
                toast.success('Berhasil menolak user')
            } else {
                toast.error('Gagal menolak user')
            }
        })
    }

    useEffect(() => {
        setCardData(data ?? initialCardData)
    }, [open])

    const handleInputKeterangan = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length > 64) return
        setCharCount(e.target.value.length)
        form.setValue('keterangan', e.target.value)
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
                <DialogTitle variant='h4' className='p-6 sm:pbs-8 sm:pbe-6 sm:pli-8 text-center'>
                    Apakah anda yakin ingin mereject {nama} - {npwp}?
                </DialogTitle>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <DialogContent className='overflow-visible pbs-0 p-6 sm:pli-16 space-y-1'>
                            <Grid item xs={12}>
                                <FormField
                                    control={form.control}
                                    name="keterangan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <CustomTextField
                                                    autoFocus
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    placeholder='Masukkan keterangan penolakan'
                                                    {...field}
                                                    value={field.value || ''}
                                                    onChange={handleInputKeterangan}
                                                />
                                            </FormControl>

                                            <div style={{ textAlign: 'right', fontSize: '12px', color: '#888' }}>
                                                {charCount}/64
                                            </div>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </Grid>
                        </DialogContent>
                        <DialogActions className='flex justify-center pbs-0 p-6 sm:pbe-8 sm:pli-8'>
                            <Button variant='contained' type='submit' disabled={loading}>
                                {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Simpan'}
                            </Button>
                            <Button variant='outlined' onClick={handleClose}>
                                Batal
                            </Button>
                        </DialogActions>
                    </form>
                </Form>
            </Dialog>
        </>
    )
}

export default RejectUserCard
