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

import { getActiveUser } from '@/service/user'

import tableStyles from '@core/styles/table.module.css'
import OpenDialogUserCreate from '@/components/dialogs/OpenDialogUserCreate'
import UserCreateCard from '@/components/dialogs/user-create'

export default function Page() {
    const buttonProps: ButtonProps = {
        variant: 'contained',
        children: 'Create New'
    }

    const [activeUsers, setActiveUsers] = useState<{
        nama: string,
        npwp: string,
        email: string
    }[]>([])

    useEffect(() => {
        getActiveUser()?.then((res) => {
            setActiveUsers(res.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

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
                                            <Button variant="contained" color="error">
                                                Download
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
