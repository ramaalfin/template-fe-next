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
import { Button, CircularProgress, MenuItem } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import type { ButtonProps } from '@mui/material/Button'

import { getInactiveUser } from '@/service/user'

import tableStyles from '@core/styles/table.module.css'
import OpenDialogVerifyUser from '@/components/dialogs/OpenDialogVerifyUser'
import VerifyUserCard from '@/components/dialogs/verify-user'
import OpenDialogRejectUser from '@/components/dialogs/OpenDialogRejectUser'
import RejectUserCard from '@/components/dialogs/rejected-user'
import { getFile } from '@/service/file'
import Sort from '@/components/Sort'
import Pagination from '@/components/Pagination'
import CustomTextField from '@/@core/components/mui/TextField'
import VendorSearch from '@/components/vendor-search'

// Custom Hook
import useLoading from '@/hooks/useLoading';

export default function Page() {
    const { withLoading } = useLoading()

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
        file_badan: string
    }[]>([])

    const [vendorName, setVendorName] = useState('')
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
    const [pagination, setPagination] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: "npwp", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getInactiveUser(
                    currentPage,
                    itemsPerPage,
                    sortConfig.key,
                    sortConfig.direction
                );

                if (res && res.data && res.data.data) {
                    setInactiveUsers(res.data.data.data);
                    setPagination(res.data.data.pageInfo);
                } else {
                    toast.error('Gagal mengambil data. Silakan coba lagi nanti.');
                }
            } catch (error) {
                toast.error('Gagal mengambil data. Silakan coba lagi nanti.');
            }
        }

        fetchData();
    }, [currentPage, itemsPerPage, sortConfig]);

    const handleSearch = async () => {
        const filteredDate = inactiveUsers.filter((item) => {
            return item.nama.toLowerCase().includes(vendorName.toLowerCase())
        });

        // jika inputan kosong maka tampilkan semua data
        if (vendorName === null || vendorName === '') {
            const res = await getInactiveUser(
                currentPage,
                itemsPerPage,
                sortConfig.key,
                sortConfig.direction
            );

            if (res && res.data && res.data.data) {
                setInactiveUsers(res.data.data.data);
                setPagination(res.data.data.pageInfo);
            } else {
                toast.error('Gagal mengambil data. Silakan coba lagi nanti.');
            }
        } else {
            setInactiveUsers(filteredDate);
        }
    }

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

    const handleSort = (key: any) => {
        const direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';

        setSortConfig({ key, direction });
    }

    const handleLimitChange = (event: any) => {
        setItemsPerPage(event.target.value);
        setCurrentPage(1);
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    return (
        <>
            <ToastContainer />
            <Card>
                <CardContent>
                    <div className="flex items-center justify-end mb-4 gap-2">
                        <div className="w-72 flex justify-end">
                            <VendorSearch
                                vendorName={vendorName}
                                onVendorNameChange={setVendorName}
                            />
                        </div>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                        >
                            Cari
                        </Button>
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
                                    <TableCell sx={{ color: "white" }}>
                                        <div className="flex justify-between">
                                            NPWP
                                            <Sort
                                                column="npwp"
                                                sortConfig={sortConfig}
                                                onSort={handleSort}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>Email</TableCell>
                                    <TableCell sx={{ color: "white" }}>File</TableCell>
                                    <TableCell sx={{ color: "white" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inactiveUsers.length > 0 ? inactiveUsers.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + itemsPerPage * (currentPage - 1)}</TableCell>
                                        <TableCell>{item.nama || '-'}</TableCell>
                                        <TableCell>{item.npwp || '-'}</TableCell>
                                        <TableCell>{item.email || '-'}</TableCell>
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

                                                <OpenDialogRejectUser element={Button} elementProps={buttonRejectProps} dialog={RejectUserCard} id_user={item.id_user} nama={item.nama} npwp={item.npwp} />
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

                    <div className="flex justify-between mt-4">
                        <CustomTextField
                            select
                            value={itemsPerPage}
                            onChange={handleLimitChange}
                            className="mr-4"
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </CustomTextField>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagination?.totalPages || 1}
                            onPageChange={paginate}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
