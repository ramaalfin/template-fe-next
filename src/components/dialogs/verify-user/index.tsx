'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'

import { Form } from '@/components/ui/form'

type VerifyUserCardData = {
    badgeColor?: ThemeColor
}

type VerifyUserCardProps = {
    open: boolean
    setOpen: (open: boolean) => void
    data?: VerifyUserCardData
}

const initialCardData: VerifyUserCardProps['data'] = {

    badgeColor: 'primary'
}

const VerifyUserCard = ({ open, setOpen, data }: VerifyUserCardProps) => {
    // States
    const [cardData, setCardData] = useState(initialCardData)

    const handleClose = () => {
        setOpen(false)
        setCardData(initialCardData)
    }

    // Form
    const form = useForm({
        resolver: zodResolver()
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
                Apakah anda yakin ingin memverifikasi user ini?
            </DialogTitle>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-y-5 justify-center">
                    <DialogActions className='flex justify-start pbs-0 p-6 sm:pbe-8 sm:pli-8'>
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

export default VerifyUserCard
