"use client"

import React from 'react'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'

// components
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'

import { MenuItem } from '@mui/material'

import Button from '@mui/material/Button'

import tableStyles from '@core/styles/table.module.css'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import CustomTextField from '@/@core/components/mui/TextField'
import { dashboardFormSchema } from '@/lib/form-schema'

export default function Page() {
    const form = useForm({
        defaultValues: {
            tahun: ''
        },

        resolver: zodResolver(dashboardFormSchema)
    });

    const onSubmit = (val: z.infer<typeof dashboardFormSchema>) => {
        console.log(val)
    };

    return (
        <>
            <Card>
                <CardContent>
                    <TableContainer>
                        <Table className={tableStyles.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Bulan</TableCell>
                                    <TableCell>Vendor</TableCell>
                                    <TableCell>NPWP</TableCell>
                                    <TableCell>Tahun</TableCell>
                                    <TableCell>Download</TableCell>
                                    <TableCell>Jumlah</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>Januari</TableCell>
                                    <TableCell>PT. ABC</TableCell>
                                    <TableCell>1234567890</TableCell>
                                    <TableCell>2021</TableCell>
                                    <TableCell>Download</TableCell>
                                    <TableCell>1</TableCell>
                                    <TableCell>Valid DJP</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-12 space-x-4 mt-8">
                <div className="col-span-4">
                    <Card>
                        <CardHeader title="CARI BERDASARKAN TAHUN" />
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="tahun"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <CustomTextField select fullWidth {...field}>
                                                        <MenuItem value=''>Pilih Tahun</MenuItem>
                                                        <MenuItem value='2024'>2024</MenuItem>
                                                        <MenuItem value='2023'>2023</MenuItem>
                                                        <MenuItem value='2022'>2022</MenuItem>
                                                        <MenuItem value='2021'>2021</MenuItem>
                                                    </CustomTextField>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button variant='contained' type='submit'>
                                        Cari
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-8">
                    <Card>
                        <CardHeader title="PERHATIAN" />
                        <CardContent>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. A eligendi quaerat sunt sint expedita aliquam repellendus labore, quia quis deleniti ullam incidunt placeat nisi tenetur libero suscipit doloremque eum est.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
