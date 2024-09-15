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

import tableStyles from '@core/styles/table.module.css'
import UploadBuktiPotongCard from '@/components/dialogs/upload-bukti-potong'
import OpenDialogUploadBuktiPotong from '@/components/dialogs/OpenDialogUploadBuktiPotong'
import { downloadTaxSlip, getAllTaxSlip } from '@/service/tax-slip'

// Custom Hook
import useLoading from '@/hooks/useLoading';

export default function Page() {
    const { withLoading } = useLoading()

    const buttonProps: ButtonProps = {
        variant: 'contained',
        children: 'Upload Tax Slip'
    }

    const [allTaxSlip, setAllTaxSlip] = useState<{
        tahun: string,
        bulan: string,
        jumlah_file: number,
        npwp: string,
        file_tax_slip: string,
        vendor: {
            nama: string
        }
    }[]>([])

    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

    useEffect(() => {
        getAllTaxSlip()?.then((res) => {
            setAllTaxSlip(res.data.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const namaBulan = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
    ]

    const handleDownload = async (index: number, file_tax_slip: string) => {
        setLoadingIndex(index);

        await withLoading(async () => {
            try {
                const res = await downloadTaxSlip(file_tax_slip);
                const base64Data = res.data.data;
                const fileName = file_tax_slip.split('|')[0];
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
            <ToastContainer />
            <Card>
                <CardContent>
                    <div className="mb-4">
                        <OpenDialogUploadBuktiPotong element={Button} elementProps={buttonProps} dialog={UploadBuktiPotongCard} />
                    </div>
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
                                    <TableCell sx={{ color: "white" }}>Bulan</TableCell>
                                    <TableCell sx={{ color: "white" }}>Tahun</TableCell>
                                    <TableCell sx={{ color: "white" }}>Jumlah</TableCell>
                                    <TableCell sx={{ color: "white" }}>File</TableCell>
                                    <TableCell sx={{ color: "white" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allTaxSlip.length > 0 ? allTaxSlip.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.vendor?.nama ?? ''}</TableCell>
                                        <TableCell>{item.npwp}</TableCell>
                                        <TableCell>{namaBulan[parseInt(item.bulan) - 1]}</TableCell>
                                        <TableCell>{item.tahun}</TableCell>
                                        <TableCell>{item.jumlah_file}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDownload(index, item.file_tax_slip)}
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
                                            <Button variant="contained" color="error">
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) :
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">Tidak Ada Data</TableCell>
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
