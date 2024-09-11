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

import { getInactiveUser } from '@/service/user'

import tableStyles from '@core/styles/table.module.css'

import OpenDialogVerifyUser from '@/components/dialogs/OpenDialogVerifyUser'
import VerifyUserCard from '@/components/dialogs/verify-user'
import OpenDialogRejectUser from '@/components/dialogs/OpenDialogRejectUser'
import RejectUserCard from '@/components/dialogs/reject-user'

export default function Page() {
    const buttonVerifyProps: ButtonProps = {
        variant: 'contained',
        children: 'Verify'
    }

    const buttonRejectProps: ButtonProps = {
        variant: 'contained',
        children: 'Reject'
    }

    const [inactiveUsers, setInactiveUsers] = useState<{
        id_user: string,
        nama: string,
        npwp: string,
        email: string,
    }[]>([])

    useEffect(() => {
        getInactiveUser()?.then((res) => {
            setInactiveUsers(res.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return (
        <>
            <Card>
                <CardContent>
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
                                {inactiveUsers.length > 0 ? inactiveUsers.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.nama}</TableCell>
                                        <TableCell>{item.npwp}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="error">
                                                Download
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-row gap-2">
                                                <OpenDialogVerifyUser element={Button} elementProps={buttonVerifyProps} dialog={VerifyUserCard} id_user={item.id_user} />

                                                <OpenDialogRejectUser element={Button} elementProps={buttonRejectProps} dialog={RejectUserCard} id_user={item.id_user} />
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
