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
import { MenuItem } from '@mui/material'

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

    const handleClose = () => {
        setOpen(false)
        setCardData(initialCardData)
    }

    const form = useForm({
        defaultValues: {
            vendor: '',
            tahun: '',
            bulan: '',
            photo: ''
        },

        resolver: zodResolver(uploadBuktiPotongFormSchema)
    });

    const onSubmit = (val: z.infer<typeof uploadBuktiPotongFormSchema>) => {
        console.log(val)
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
            <DialogTitle variant='h4' className='p-6 sm:pbs-16 sm:pbe-6 sm:pli-16'>
                Upload
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
                                    Tahun
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <FormField
                                    control={form.control}
                                    name="tahun"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <CustomTextField select fullWidth {...field} id='custom-select'>
                                                    <MenuItem value=''>Pilih Tahun</MenuItem>
                                                    <MenuItem value='2024'>2024</MenuItem>
                                                    <MenuItem value='2023'>2023</MenuItem>
                                                    <MenuItem value='2022'>2022</MenuItem>
                                                    <MenuItem value='2021'>2021</MenuItem>
                                                    <MenuItem value='2020'>2020</MenuItem>
                                                    <MenuItem value='2019'>2019</MenuItem>
                                                    <MenuItem value='2018'>2018</MenuItem>
                                                    <MenuItem value='2017'>2017</MenuItem>
                                                    <MenuItem value='2016'>2016</MenuItem>
                                                    <MenuItem value='2015'>2015</MenuItem>
                                                    <MenuItem value='2014'>2014</MenuItem>
                                                    <MenuItem value='2013'>2013</MenuItem>
                                                    <MenuItem value='2012'>2012</MenuItem>
                                                    <MenuItem value='2011'>2011</MenuItem>
                                                    <MenuItem value='2010'>2010</MenuItem>
                                                </CustomTextField>
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
                                    Bulan
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <FormField
                                    control={form.control}
                                    name="bulan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <CustomTextField select fullWidth {...field} id='custom-select'>
                                                    <MenuItem value=''>Pilih Bulan</MenuItem>
                                                    <MenuItem value='Januari'>Januari</MenuItem>
                                                    <MenuItem value='Februari'>Februari</MenuItem>
                                                    <MenuItem value='Maret'>Maret</MenuItem>
                                                    <MenuItem value='April'>April</MenuItem>
                                                    <MenuItem value='Mei'>Mei</MenuItem>
                                                    <MenuItem value='Juni'>Juni</MenuItem>
                                                    <MenuItem value='Juli'>Juli</MenuItem>
                                                    <MenuItem value='Agustus'>Agustus</MenuItem>
                                                    <MenuItem value='September'>September</MenuItem>
                                                    <MenuItem value='Oktober'>Oktober</MenuItem>
                                                    <MenuItem value='November'>November</MenuItem>
                                                    <MenuItem value='Desember'>Desember</MenuItem>
                                                </CustomTextField>
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
        </Dialog >
    )
}

export default UploadBuktiPotongCard
