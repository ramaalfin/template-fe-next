'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'

import { Form } from '@/components/ui/form'
import { activateUser } from '@/service/user'

type VerifyUserCardData = {
    badgeColor?: ThemeColor
}

type VerifyUserCardProps = {
    open: boolean
    setOpen: (open: boolean) => void
    data?: VerifyUserCardData
    id_user: string
}

const initialCardData: VerifyUserCardProps['data'] = {

    badgeColor: 'primary'
}

const VerifyUserCard = ({ open, setOpen, data, id_user }: VerifyUserCardProps) => {
    // States
    const [cardData, setCardData] = useState(initialCardData)

    const handleClose = () => {
        setOpen(false)
        setCardData(initialCardData)
    }

    const onSubmit = async () => {
        const response = await activateUser(id_user)

        if (response?.data.code === 200) {
            setOpen(false)
            window.location.reload()
        } else {
            alert('Failed to activate user')
        }
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
            <DialogActions className='flex justify-center pbs-0 p-6 sm:pbe-8 sm:pli-8'>
                <Button variant='contained' type='submit' onClick={onSubmit}>
                    Simpan
                </Button>
                <Button variant='outlined' onClick={handleClose}>
                    Batal
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default VerifyUserCard
