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
import type { ButtonProps } from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify'

import tableStyles from '@core/styles/table.module.css'
import UploadBuktiPotongCard from '@/components/dialogs/upload-bukti-potong'
import OpenDialogUploadBuktiPotong from '@/components/dialogs/OpenDialogUploadBuktiPotong'
import { downloadTaxSlip, getAllTaxSlip } from '@/service/tax-slip'
import Sort from '@/components/Sort'
import Pagination from '@/components/Pagination'
import CustomTextField from '@/@core/components/mui/TextField'
import VendorSearch from '@/components/vendor-search'

// Custom Hook
import useLoading from '@/hooks/useLoading';

export default function Page() {
    const { withLoading } = useLoading()

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

    const [vendorName, setVendorName] = useState('')
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
    const [pagination, setPagination] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: "bulan", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllTaxSlip(
                    currentPage,
                    itemsPerPage,
                    sortConfig.key,
                    sortConfig.direction
                );

                if (res && res.data && res.data.data) {
                    setAllTaxSlip(res.data.data.data);
                    setPagination(res.data.data.pageInfo);
                } else {
                    toast.error('Failed to fetch data. Please try again later.');
                }
            } catch (error) {
                toast.error('Failed to fetch data. Please try again later.');
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, sortConfig]);

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

    const handleSearch = async () => {
        const filteredDate = allTaxSlip.filter((item) => {
            return item.vendor?.nama.toLowerCase().includes(vendorName.toLowerCase())
        });

        // jika inputan kosong maka tampilkan semua data
        if (vendorName === null || vendorName === '') {
            const res = await getAllTaxSlip(
                currentPage,
                itemsPerPage,
                sortConfig.key,
                sortConfig.direction
            );

            if (res && res.data && res.data.data) {
                setAllTaxSlip(res.data.data.data);
                setPagination(res.data.data.pageInfo);
            } else {
                toast.error('Gagal mengambil data. Silakan coba lagi nanti.');
            }
        } else {
            setAllTaxSlip(filteredDate);
        }

    }

    const handleDownload = async (index: number, file_tax_slip: string) => {
        setLoadingIndex(index);

        await withLoading(async () => {
            try {
                const res = await downloadTaxSlip(file_tax_slip);
                const base64Data = res.data.data;
                const fileName = file_tax_slip.split('|')[0];
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
                    <div className="flex justify-between items-center mb-4">
                        <OpenDialogUploadBuktiPotong element={Button} elementProps={buttonProps} dialog={UploadBuktiPotongCard} />

                        <div className="flex items-center justify-end gap-2">
                            <VendorSearch
                                vendorName={vendorName}
                                onVendorNameChange={setVendorName}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSearch}
                            >
                                Cari
                            </Button>
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
                                    <TableCell sx={{ color: "white" }}>NPWP</TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        <div className="flex justify-between">
                                            Bulan
                                            <Sort
                                                column="bulan"
                                                sortConfig={sortConfig}
                                                onSort={handleSort}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        <div className="flex justify-between">
                                            Tahun
                                            <Sort
                                                column="tahun"
                                                sortConfig={sortConfig}
                                                onSort={handleSort}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>Jumlah</TableCell>
                                    <TableCell sx={{ color: "white" }}>File</TableCell>
                                    <TableCell sx={{ color: "white" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allTaxSlip.length > 0 ? allTaxSlip.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + itemsPerPage * (currentPage - 1)}</TableCell>
                                        <TableCell>{item.vendor?.nama ?? ''}</TableCell>
                                        <TableCell>{item.npwp}</TableCell>
                                        <TableCell>{namaBulan[parseInt(item.bulan) - 1]}</TableCell>
                                        <TableCell>{item.tahun}</TableCell>
                                        <TableCell>{item.jumlah_file}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDownload(index, item.file_tax_slip)}
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
