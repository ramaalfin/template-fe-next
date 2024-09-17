"use client"

import React, { useEffect, useState } from 'react'

import useAuthStore from '@/store/useAuthStore'

export default function Page() {
    // get name from useAuthStore
    const { user } = useAuthStore()
    const [name, setName] = useState<string | null>(null)

    useEffect(() => {
        setName(user?.username)
    }, [user])

    return (
        <h1>Home {name}!</h1>
    )
}
