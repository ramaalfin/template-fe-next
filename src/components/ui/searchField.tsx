"use client";

import { useEffect } from 'react';

import CustomTextField from '@/@core/components/mui/TextField';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    width?: string;
    delay?: number;
}

const SearchField = ({ value, onChange, placeholder = "Search...", width = '100%', delay = 500 }: SearchFieldProps) => {
    const debouncedValue = useDebounce(value, delay);

    useEffect(() => {
        onChange(debouncedValue);
    }, [debouncedValue, onChange]);

    return (
        <CustomTextField
            placeholder={placeholder}
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
                width: width,
            }}
        />
    )
}

export default SearchField
