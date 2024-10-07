"use client"

import { useCallback, useEffect, useState } from 'react'

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
import type { ButtonProps } from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify'

import tableStyles from '@core/styles/table.module.css'
import UserCreateCard from '@/components/dialogs/create-user'
import Sort from '@/components/ui/sort'
import Pagination from '@/components/ui/pagination'
import CustomTextField from '@/@core/components/mui/TextField'
import OpenDialogCreateUser from '@/components/dialogs/OpenDialogCreateUser'
import OpenDialogDeleteUser from '@/components/dialogs/OpenDialogDeleteUser'
import OpenDialogLogoutUser from '@/components/dialogs/OpenDialogLogoutUser'
import DeleteUserCard from '@/components/dialogs/delete-user'
import LogoutUserCard from '@/components/dialogs/logout-user'
import SearchField from '@/components/ui/searchField'

// Custom Hook
import useLoading from '@/hooks/useLoading';
import { useRefreshToken } from '@/hooks/useRefreshToken'

// services
import { getActiveUser } from '@/service/user'
import { getFile } from '@/service/file'
import OpenDialogEditUser from '@/components/dialogs/OpenDialogEditUser'
import EditUserCard from '@/components/dialogs/edit-user'

interface ActiveUser {
    id_user: string,
    nama: string,
    npwp: string,
    email: string,
    file_badan: string,
    entry_on: string
}

interface PaginationInfo {
    totalPages: number;
    [key: string]: any;
}

interface SortConfig {
    key: string;
    direction: string;
}

export default function Page() {
    const { withLoading } = useLoading()
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo>();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const refreshUserToken = useRefreshToken;

    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'entry_on', direction: 'asc'
    });

    const buttonProps: ButtonProps = {
        variant: 'contained',
    }

    const filterData = useCallback(
        (items: ActiveUser[]) =>
            items.filter((item) =>
                searchTerm === '' ? true :
                    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.npwp.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.email.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [searchTerm]
    );

    const loadData = useCallback(async () => {
        const res = await getActiveUser(
            currentPage,
            itemsPerPage,
            sortConfig.key,
            sortConfig.direction
        );

        if (res && res.data && res.data.data) {
            setActiveUsers(res.data.data.data);
            setPagination(res.data.data.pageInfo);
        } else {
            toast.error('Gagal mengambil data. Silakan coba lagi nanti.');
        }
    }, [currentPage, itemsPerPage, sortConfig]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDownload = async (index: number, file_badan: string) => {
        setLoadingIndex(index);

        await withLoading(async () => {
            const tokenRefreshed = await refreshUserToken()

            if (!tokenRefreshed) return;

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
        setSortConfig(prev => ({
            key,
            direction: (prev.key === key && prev.direction === 'asc') ? 'desc' : 'asc',
        }));
    };

    const handleLimitChange = (event: any) => {
        setItemsPerPage(event.target.value);
        setCurrentPage(1);
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
    const filteredData = filterData(activeUsers);

    return (
        <>
            <ToastContainer />
            <Card>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <OpenDialogCreateUser
                            element={Button}
                            elementProps={{ ...buttonProps, children: 'Tambah User' }}
                            dialog={UserCreateCard}
                            refreshData={loadData}
                        />

                        <div className="flex items-center justify-end gap-2">
                            <SearchField
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Cari Nama Vendor, Email atau NPWP"
                                delay={500}
                            />
                        </div>
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
                                    <TableCell sx={{ color: "white" }}>File Izin</TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        <div className="flex justify-between">
                                            Tgl. Daftar
                                            <Sort
                                                column="entry_on"
                                                sortConfig={sortConfig}
                                                onSort={handleSort}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.length > 0 ? filteredData.map((item, index) => (
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
                                        <TableCell>{item.entry_on ? new Intl.DateTimeFormat('ID-id', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta', }).format(new Date(item.entry_on)) : '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-row gap-2">
                                                <OpenDialogEditUser
                                                    element={Button}
                                                    elementProps={{ ...buttonProps, children: 'Edit' }}
                                                    dialog={EditUserCard}
                                                    id_user={item.id_user}
                                                    refreshData={loadData}
                                                />
                                                <OpenDialogDeleteUser
                                                    element={Button}
                                                    elementProps={{ ...buttonProps, children: 'Delete' }}
                                                    dialog={DeleteUserCard}
                                                    id_user={item.id_user}
                                                    refreshData={loadData}
                                                />
                                                <OpenDialogLogoutUser
                                                    element={Button}
                                                    elementProps={{ ...buttonProps, children: 'Logout' }}
                                                    dialog={LogoutUserCard}
                                                    id_user={item.id_user}
                                                    refreshData={loadData}
                                                />

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
