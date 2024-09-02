import React, { useEffect, useState } from 'react';

import { Modal, Box, Typography, Button } from '@mui/material';

import { refreshAccessToken } from '@/service/auth';

import useAuthStore from '@/store/useAuthStore';

const RefreshTokenModal = ({ open, handleClose }) => {
    const { token } = useAuthStore()

    const refreshToken = token?.refresh.token

    useEffect(() => {
        if (token) {
            setRefreshToken(token?.refresh.token)
        }
    }, [token])

    const handleRefresh = async (refreshToken: string) => {
        try {
            await refreshAccessToken(refreshToken);
            handleClose(); // Tutup modal setelah token diperbarui
        } catch (error) {
            console.error('Failed to refresh token', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Session Expiring Soon
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Your session is about to expire. Do you want to refresh your session?
                </Typography>
                <Box mt={2}>
                    <Button variant="contained" color="primary" onClick={() => handleRefresh(refreshToken)}>
                        Refresh Token
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ ml: 2 }}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default RefreshTokenModal;
