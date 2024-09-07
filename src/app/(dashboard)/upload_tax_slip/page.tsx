"use client"

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

export default function Page() {
    const buttonProps: ButtonProps = {
        variant: 'contained',
        children: 'Create New'
    }

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
                                    <TableCell sx={{ color: "white" }}>Tahun</TableCell>
                                    <TableCell sx={{ color: "white" }}>Bulan</TableCell>
                                    <TableCell sx={{ color: "white" }}>Vendor</TableCell>
                                    <TableCell sx={{ color: "white" }}>File</TableCell>
                                    <TableCell sx={{ color: "white" }}>Jumlah</TableCell>
                                    <TableCell sx={{ color: "white" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>2021</TableCell>
                                    <TableCell>Januari</TableCell>
                                    <TableCell>PT. ABC</TableCell>
                                    <TableCell>Download</TableCell>
                                    <TableCell>1</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="error">
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </>
    )
}
