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

import { Button } from '@mui/material'

import tableStyles from '@core/styles/table.module.css'

import UploadBuktiPotongCard from '@/components/dialogs/upload-bukti-potong'
import OpenDialogUploadBuktiPotong from '@/components/dialogs/OpenDialogUploadBuktiPotong'
import { downloadTaxSlip, getAllTaxSlip } from '@/service/tax-slip'

export default function Page() {
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

    useEffect(() => {
        getAllTaxSlip()?.then((res) => {
            setAllTaxSlip(res.data.data)
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

    const handleDownload = (file_tax_slip: string) => {
        downloadTaxSlip(file_tax_slip)
            .then((res) => {
                const base64Data = res.data.data;
                const fileName = file_tax_slip.split('|')[0];
                const downloadLink = document.createElement("a");

                downloadLink.href = base64Data;
                downloadLink.download = fileName ?? 'file';
                downloadLink.click();
                downloadLink.remove();
            })
            .catch((err) => {
                console.log(err)
            })
    }

    console.log(allTaxSlip);


    return (
        <>
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
                                            <Button variant="contained" color="error" onClick={() => handleDownload(`${item.file_tax_slip}`)}>
                                                Download
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
