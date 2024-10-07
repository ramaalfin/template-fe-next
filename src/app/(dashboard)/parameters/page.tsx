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
import { Button, MenuItem } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'

import tableStyles from '@core/styles/table.module.css'
import Sort from '@/components/ui/sort'
import Pagination from '@/components/ui/pagination'
import SearchField from '@/components/ui/searchField'
import CustomTextField from '@/@core/components/mui/TextField'
import EditParameterCard from '@/components/dialogs/edit-parameter'
import CreateParameterCard from '@/components/dialogs/create-parameter'
import DeleteParameterCard from '@/components/dialogs/delete-parameter'
import OpenDialogCreateParameter from '@/components/dialogs/OpenDialogCreateParameter'
import OpenDialogDeleteParameter from '@/components/dialogs/OpenDialogDeleteParameter'
import OpenDialogEditParameter from '@/components/dialogs/OpenDialogEditParameter'

// services
import { getAllParameters } from '@/service/parameters'

interface Parameter {
    id_parameter: string,
    parameter: string,
    deskripsi: string,
    nilai: string,
    nilai_html: string,
}

interface PaginationInfo {
    totalPages: number;
    [key: string]: any;
}

interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

export default function Page() {
    const [parameters, setParameters] = useState<Parameter[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'deskripsi', direction: 'asc'
    });

    const buttonProps = {
        variant: "contained",
    };

    const filterData = useCallback(
        (items: Parameter[]) =>
            items.filter((item) =>
                searchTerm === '' ? true :
                    item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.parameter.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [searchTerm]
    );

    const loadData = useCallback(async () => {
        try {
            const res = await getAllParameters(
                currentPage,
                itemsPerPage,
                sortConfig.key,
                sortConfig.direction,
            );

            if (res?.data.data) {
                setParameters(res.data.data.data);
                setPagination(res.data.data.pageInfo);
            } else {
                toast.error('Gagal mengambil data. Silakan coba lagi nanti.');
            }
        } catch (error) {
            toast.error('Gagal mengambil data. Silakan coba lagi nanti.');
        }
    }, [currentPage, itemsPerPage, sortConfig]);

    useEffect(() => {
        loadData();
    }, [loadData]);

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
    const filteredData = filterData(parameters);

    return (
        <>
            <ToastContainer />
            <Card>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <OpenDialogCreateParameter
                            element={Button}
                            elementProps={{ ...buttonProps, children: 'Tambah Parameter' }}
                            dialog={CreateParameterCard}
                            refreshData={loadData}
                        />

                        <div className="flex items-center justify-end gap-2">
                            <SearchField
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Cari Deskripsi atau Parameter"
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
                                    <TableCell sx={{ color: "white" }}>
                                        <div className="flex justify-between">
                                            Deskripsi
                                            <Sort
                                                column="deskripsi"
                                                sortConfig={sortConfig}
                                                onSort={handleSort}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>Parameter</TableCell>
                                    <TableCell sx={{ color: "white" }}>Nilai</TableCell>
                                    <TableCell sx={{ color: "white" }}>Nilai HTML</TableCell>
                                    <TableCell sx={{ color: "white" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.length > 0 ? filteredData.map((item, index) => (
                                    <TableRow key={item.id_parameter}>
                                        <TableCell sx={{ verticalAlign: 'top' }}>{index + 1 + itemsPerPage * (currentPage - 1)}</TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>{item.deskripsi || '-'}</TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>{item.parameter || '-'}</TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            <div className='whitespace-pre-wrap'>{item.nilai || '-'}</div>
                                        </TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            <div className='whitespace-pre-wrap'>{item.nilai_html || '-'}</div>
                                        </TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            <div className="flex flex-row gap-2">
                                                <OpenDialogEditParameter
                                                    element={Button}
                                                    elementProps={{ ...buttonProps, children: 'Edit' }}
                                                    dialog={EditParameterCard}
                                                    id_parameter={item.id_parameter}
                                                    refreshData={loadData}
                                                />
                                                <OpenDialogDeleteParameter
                                                    element={Button}
                                                    elementProps={{ ...buttonProps, children: 'Hapus' }}
                                                    dialog={DeleteParameterCard}
                                                    id_parameter={item.id_parameter}
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
