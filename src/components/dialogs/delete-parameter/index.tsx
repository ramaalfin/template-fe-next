'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import { CircularProgress } from '@mui/material'
import { toast } from 'react-toastify';

// Custom Hook
import useLoading from '@/hooks/useLoading';
import { useRefreshToken } from '@/hooks/useRefreshToken'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'

import { deleteParameter } from '@/service/parameters'

type DeleteParameterCardData = {
    badgeColor?: ThemeColor
}

type DeleteParameterCardProps = {
    open: boolean
    setOpen: (open: boolean) => void
    data?: DeleteParameterCardData
    id_parameter: string
    refreshData: () => void
}

const initialCardData: DeleteParameterCardProps['data'] = {
    badgeColor: 'primary'
}

const DeleteParameterCard = ({ open, setOpen, data, refreshData, id_parameter }: DeleteParameterCardProps) => {
    const { loading, withLoading } = useLoading()
    const refreshUserToken = useRefreshToken
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [cardData, setCardData] = useState(initialCardData)

    const handleClose = () => {
        setOpen(false)
        setCardData(initialCardData)
    }

    const onSubmit = async () => {
        await withLoading(async () => {
            const tokenRefreshed = await refreshUserToken()

            if (!tokenRefreshed) return;

            const response = await deleteParameter(id_parameter)

            if (response?.data.code === 200) {
                setOpen(false)
                toast.success('Berhasil menghapus parameter')

                refreshData()
            } else {
                toast.error('Gagal menghapus parameter')
            }
        })
    }

    useEffect(() => {
        setCardData(data ?? initialCardData)
    }, [open, data])

    return (
        <>
            <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
                <DialogTitle variant='h4' className='p-6 sm:pbs-8 sm:pbe-6 sm:pli-8 text-center'>
                    Apakah anda yakin ingin menghapus parameter ini?
                </DialogTitle>
                <DialogActions className='flex justify-center pbs-0 p-6 sm:pbe-8 sm:pli-8'>
                    <Button variant='contained' type='submit' onClick={onSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Simpan'}
                    </Button>
                    <Button variant='outlined' onClick={handleClose}>
                        Batal
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteParameterCard
