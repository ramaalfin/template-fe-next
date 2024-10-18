"use client";

import { useEffect, useState } from "react";

import { deleteCookie, getCookie, setCookie } from "cookies-next";
import Button from "@mui/material/Button";

import { CircularProgress } from "@mui/material";

import useLoading from "@/hooks/useLoading";
import { logout, refreshToken } from "@/service/auth";

const timeToMilliseconds = (time: any) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);

    return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
};

const DialogProvider = () => {
    const [open, setOpen] = useState(false);
    const [expirationMilliseconds, setExpirationMilliseconds] = useState(0);
    const { loading, withLoading } = useLoading();

    console.log(expirationMilliseconds);


    useEffect(() => {
        const intervalId = setInterval(() => {
            const tokenStr = getCookie("token-admin");
            const token = tokenStr ? JSON.parse(tokenStr as string) : null;


            if (token?.access?.expires) {
                const expiredTokenTime = token.access.expires.slice(11, 19);


                setExpirationMilliseconds(timeToMilliseconds(expiredTokenTime));
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!expirationMilliseconds) return;

        const checkTimeLeft = () => {
            const currentMilliseconds =
                new Date().getHours() * 60 * 60 * 1000 +
                new Date().getMinutes() * 60 * 1000 +
                new Date().getSeconds() * 1000;

            const timeDifference = expirationMilliseconds - currentMilliseconds;

            if (timeDifference <= 30000 && timeDifference > 0) {
                setOpen(true);
            }

            if (timeDifference <= 0) {
                handleLogout();
            }
        };

        const intervalId = setInterval(checkTimeLeft, 1000);

        return () => clearInterval(intervalId);
    }, [expirationMilliseconds]);

    const handleRefresh = async () => {
        await withLoading(async () => {
            const tokenStr = getCookie("token-admin");
            const token = tokenStr ? JSON.parse(tokenStr as string) : null;

            if (!token?.refresh?.token) return;

            try {
                const response = await refreshToken(token.refresh.token);

                if (response.code === 200) {
                    setCookie("token-admin", JSON.stringify(response.data));
                    setOpen(false);
                    window.location.reload();
                } else {
                    console.error("Failed to refresh token:", response.message);
                }
            } catch (error) {
                console.error("Error refreshing token:", error);
            }
        });
    };

    const handleLogout = async () => {
        const tokenStr = getCookie("token-admin");
        const token = tokenStr ? JSON.parse(tokenStr as string) : null;

        if (!token?.access?.token) return;

        try {
            const response = await logout(token.access.token);

            if (response.code === 200) {
                deleteCookie("user-admin");
                deleteCookie("token-admin");
                window.location.href = "/login";
            } else {
                console.error("Logout failed. Status:", response.status);
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <>
            {open && (
                <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg">
                        <p className="text-lg">Apakah Anda ingin memperpanjang sesi?</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <Button variant="contained" color="secondary" onClick={handleRefresh}>
                                {loading ? <CircularProgress size={24} /> : "Ya"}
                            </Button>
                            <Button variant="contained" color="error" onClick={handleLogout}>
                                Tidak
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DialogProvider;
