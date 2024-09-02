"use client"

import React, { useEffect, useState } from 'react'

export default function Page() {
    const [value, setValue] = useState("initial")

    return (
        <>
            <h1>roles users page {value}</h1>

            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        </>
    )
}
