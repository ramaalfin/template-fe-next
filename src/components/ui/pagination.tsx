import React from "react";

import { Button } from "@mui/material";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [...Array(totalPages).keys()].map(n => n + 1);

    return (
        <nav
            className="relative z-0 inline-flex rounded-md space-x-3"
            aria-label="Pagination"
        >
            {pages.map(page => (
                <Button
                    key={page}
                    variant={currentPage === page ? 'contained' : 'outlined'}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))}
        </nav>
    );
};

export default Pagination;
