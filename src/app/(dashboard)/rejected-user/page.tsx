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
import type { ButtonProps } from '@mui/material/Button'
import { Button, CircularProgress } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'

import { getRejectUser } from '@/service/user'

import tableStyles from '@core/styles/table.module.css'
import OpenDialogVerifyUser from '@/components/dialogs/OpenDialogVerifyUser'
import VerifyUserCard from '@/components/dialogs/verify-user'
import { getFile } from '@/service/file'

// Custom Hook
import useLoading from '@/hooks/useLoading';

export default function Page() {
    const { withLoading } = useLoading()

    const buttonVerifyProps: ButtonProps = {
        variant: 'contained',
        children: 'Verify'
    }

    const [rejectedUsers, setRejectedUsers] = useState<{
        id_user: string,
        nama: string,
        npwp: string,
        email: string,
        file_badan: string
    }[]>([])

    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

    useEffect(() => {
        getRejectUser()?.then((res) => {
            setRejectedUsers(res.data.data.data)
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
                                    <TableCell sx={{ color: "white" }}>Nama Vendor</TableCell>
                                    <TableCell sx={{ color: "white" }}>NPWP</TableCell>
                                    <TableCell sx={{ color: "white" }}>Email</TableCell>
                                    <TableCell sx={{ color: "white" }}>File</TableCell>
                                    <TableCell sx={{ color: "white" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rejectedUsers.length > 0 ? rejectedUsers.map((item, index) => (
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
                                            <div className="flex flex-row gap-2">
                                                <OpenDialogVerifyUser element={Button} elementProps={buttonVerifyProps} dialog={VerifyUserCard} id_user={item.id_user} />
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
