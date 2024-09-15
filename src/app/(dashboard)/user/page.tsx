"use client"

import { useEffect, useState } from 'react'

// components
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { Button, CircularProgress } from '@mui/material'
import type { ButtonProps } from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify'

import { getActiveUser } from '@/service/user'

import tableStyles from '@core/styles/table.module.css'
import OpenDialogUserCreate from '@/components/dialogs/OpenDialogUserCreate'
import UserCreateCard from '@/components/dialogs/user-create'
import { getFile } from '@/service/file'

// Custom Hook
import useLoading from '@/hooks/useLoading';

export default function Page() {
    const { withLoading } = useLoading()

    const buttonProps: ButtonProps = {
        variant: 'contained',
        children: 'Create New'
    }

    const [activeUsers, setActiveUsers] = useState<{
        nama: string,
        npwp: string,
        email: string,
        file_badan: string
    }[]>([])

    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

    useEffect(() => {
        getActiveUser()?.then((res) => {
            setActiveUsers(res.data.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const handleDownload = async (index: number, file_badan: string) => {
        setLoadingIndex(index);

        await withLoading(async () => {
            try {
                const res = await getFile(file_badan);
                const base64Data = res.data.data;
                const fileName = file_badan.split('|')[0];
                const downloadLink = document.createElement("a");

                downloadLink.href = base64Data;
                downloadLink.download = fileName ?? 'file';
                downloadLink.click();
                downloadLink.remove();
            } catch (error) {
                toast.error('Gagal mengunduh file. Silakan coba lagi nanti.');
            } finally {
                setLoadingIndex(null);
            }
        });
    }

    return (
        <>
            <Card>
                <CardContent>
                    <div className="mb-4">
                        <OpenDialogUserCreate element={Button} elementProps={buttonProps} dialog={UserCreateCard} />
                    </div>
                    <ToastContainer />
                    <TableContainer>
                        <Table className={tableStyles.table}>
                            <TableHead
                                sx={{
                                    backgroundColor: 'var(--mui-palette-primary-main)',
                                }}
                            >
                                <TableRow>
                                    <TableCell sx={{ color: "white" }}>No</TableCell>
                                    <TableCell sx={{ color: "white" }}>Vendor</TableCell>
                                    <TableCell sx={{ color: "white" }}>NPWP</TableCell>
                                    <TableCell sx={{ color: "white" }}>Email</TableCell>
                                    <TableCell sx={{ color: "white" }}>File Izin</TableCell>
                                    <TableCell sx={{ color: "white" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activeUsers.length > 0 ? activeUsers.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.nama}</TableCell>
                                        <TableCell>{item.npwp}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDownload(index, item.file_badan)}
                                                disabled={loadingIndex === index}
                                            >
                                                {loadingIndex === index ? (
                                                    <CircularProgress size={24} sx={{ color: '#ffffff' }} />
                                                ) : (
                                                    'Download'
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            {/* button edit and delete */}
                                            <div className="flex flex-row gap-2">
                                                <Button variant="contained" color="warning">
                                                    Edit
                                                </Button>
                                                <Button variant="contained" color="error">
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) :
                                    <TableRow>
                                        <TableCell colSpan={6} className='text-center'>Tidak Ada Data</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </>
    )
}
