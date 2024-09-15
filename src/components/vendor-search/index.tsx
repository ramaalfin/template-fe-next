import CustomTextField from '@/@core/components/mui/TextField';

interface VendorSearchProps {
    vendorName: string;
    onVendorNameChange: (name: string) => void;
}

const VendorSearch = ({ vendorName, onVendorNameChange }: VendorSearchProps) => {
    return (
        <CustomTextField
            placeholder="Cari Nama Vendor"
            fullWidth
            value={vendorName}
            onChange={(e) => onVendorNameChange(e.target.value)}
            sx={{
                width: '70%',
            }}
        />
    )
}

export default VendorSearch
