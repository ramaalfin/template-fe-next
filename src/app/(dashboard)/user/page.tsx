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
import OpenDialogUserCreate from '@/components/dialogs/OpenDialogUserCreate'
import UserCreateCard from '@/components/dialogs/user-create'

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
                        <OpenDialogUserCreate element={Button} elementProps={buttonProps} dialog={UserCreateCard} />
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
                                    <TableCell sx={{ color: "white" }}>File Izin</TableCell>
                                    <TableCell sx={{ color: "white" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>PT. ABC</TableCell>
                                    <TableCell>1234567890</TableCell>
                                    <TableCell>Download</TableCell>
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
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </>
    )
}
