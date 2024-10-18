"use client"

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation'

import { IdleTimerProvider } from 'react-idle-timer'

import { deleteCookie, getCookie } from 'cookies-next'

import { logout } from '@/service/auth'

export const IdleProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const tokenData = getCookie('token-admin')
    const token = tokenData ? JSON.parse(tokenData) : null

    const handleOnIdle = async () => {
        try {
            if (token?.access?.token) {
                const response = await logout(token.access.token);

                if (response.code === 200) {
                    deleteCookie('user-admin');
                    deleteCookie('token-admin');
                    router.push('/login');
                } else {
                    console.error('Logout failed. Status:', response.status);
                }
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    return (
        <IdleTimerProvider timeout={180000} onIdle={handleOnIdle}>
            {children}
        </IdleTimerProvider>
    )
}