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
import OpenDialogVerifyUser from '@/components/dialogs/OpenDialogVerifyUser'
import VerifyUserCard from '@/components/dialogs/verify-user'
import OpenDialogRejectUser from '@/components/dialogs/OpenDialogRejectUser'
import RejectUserCard from '@/components/dialogs/reject-user'

export default function Page() {
    const buttonProps: ButtonProps = {
        variant: 'contained',
        children: 'Create New'
    }

    const buttonVerifyProps: ButtonProps = {
        variant: 'contained',
        children: 'Verify'
    }

    const buttonRejectProps: ButtonProps = {
        variant: 'contained',
        children: 'Reject'
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
                                    <TableCell sx={{ color: "white" }}>Nama Vendor</TableCell>
                                    <TableCell sx={{ color: "white" }}>NPWP</TableCell>
                                    <TableCell sx={{ color: "white" }}>File</TableCell>
                                    <TableCell sx={{ color: "white" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>PT. ABC</TableCell>
                                    <TableCell>123456789</TableCell>
                                    <TableCell>Download</TableCell>
                                    <TableCell>
                                        {/* button edit and delete */}
                                        <div className="flex flex-row gap-2">
                                            <OpenDialogVerifyUser element={Button} elementProps={buttonVerifyProps} dialog={VerifyUserCard} />

                                            <OpenDialogRejectUser element={Button} elementProps={buttonRejectProps} dialog={RejectUserCard} />
                                        </div>
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
