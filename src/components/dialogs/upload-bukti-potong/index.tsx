'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

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
import { uploadBuktiPotongFormSchema } from '@/lib/form-schema'
import AppReactDatepicker from '@/lib/styles/AppReactDatepicker'
import { uploadTaxSlip } from '@/service/tax-slip'

type UploadBuktiPotongCardData = {
    badgeColor?: ThemeColor
}

type UploadBuktiPotongCardProps = {
    open: boolean
    setOpen: (open: boolean) => void
    data?: UploadBuktiPotongCardData
}

const initialCardData: UploadBuktiPotongCardProps['data'] = {

    badgeColor: 'primary'
}

const UploadBuktiPotongCard = ({ open, setOpen, data }: UploadBuktiPotongCardProps) => {
    // States
    const [cardData, setCardData] = useState(initialCardData)
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [errorFile, setErrorFile] = useState<string | null>(null)

    const handleClose = () => {
        setOpen(false)
        setCardData(initialCardData)

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const form = useForm({
        defaultValues: {
            periode: new Date(),
            file: null
        },

        resolver: zodResolver(uploadBuktiPotongFormSchema)
    });

    const onSubmit = async (val: z.infer<typeof uploadBuktiPotongFormSchema>) => {
        const periode = val.periode
        const file = fileInputRef.current?.files?.[0];

        if (!file) {
            return setErrorFile('File harus diunggah')
        }

        const bulan = periode.getMonth() + 1
        const tahun = periode.getFullYear()

        const formData = new FormData()

        formData.append('file', file)
        formData.append('bulan', bulan.toString())
        formData.append('tahun', tahun.toString())

        try {
            const response = await uploadTaxSlip(formData)

            if (response?.data.code === 200) {
                // reload browser
                window.location.reload()
            } else {
                alert('Gagal mengunggah file')
            }
        } catch (error) {
            console.error(error)
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        handleClose()
    };

    useEffect(() => {
        setCardData(data ?? initialCardData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
            <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
                <i className='tabler-x' />
            </DialogCloseButton>
            <DialogTitle variant='h4' className='p-6 sm:pbs-8 sm:pbe-6 sm:pli-8'>
                Upload
                <Typography component='span' className='flex flex-col'>
                    Tax Slip
                </Typography>
            </DialogTitle>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" encType='multipart/form-data'>
                    <DialogContent className='overflow-visible pbs-0 p-6 sm:pli-8 space-y-1'>
                        <Grid container spacing={6}>
                            <Grid item xs={6}>
                                <Typography variant='h6' className='mb-4'>
                                    Periode
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <FormField
                                    control={form.control}
                                    name="periode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <AppReactDatepicker
                                                    selected={field.value}
                                                    showMonthYearPicker
                                                    placeholderText='MM/YYYY'
                                                    dateFormat='MM/yyyy'
                                                    customInput={<CustomTextField fullWidth />}
                                                    onChange={(date) => field.onChange(date)}
                                                />
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
                                    Bukti Potong
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={({ }) => (
                                        <FormItem>
                                            <FormControl>
                                                <CustomTextField
                                                    ref={fileInputRef}
                                                    fullWidth
                                                    type='file'
                                                />
                                            </FormControl>
                                            {errorFile && <FormMessage>{errorFile}</FormMessage>}
                                        </FormItem>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions className='flex justify-start pbs-0 p-6 sm:pbe-8 sm:pli-8'>
                        <Button variant='contained' type='submit' fullWidth>
                            Simpan
                        </Button>
                    </DialogActions>
                </form>
            </Form>
        </Dialog >
    )
}

export default UploadBuktiPotongCard
