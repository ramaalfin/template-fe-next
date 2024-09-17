'use client'

// React Imports
import { useState } from 'react'
import type { ComponentType } from 'react'

type OpenDialogRejectUserProps = {
    element: ComponentType<any>
    dialog: ComponentType<any>
    elementProps?: any
    dialogProps?: any
    id_user: string
    nama: string
    npwp: string
}

const OpenDialogRejectUser = (props: OpenDialogRejectUserProps) => {
    // Props
    const { element: Element, dialog: Dialog, elementProps, dialogProps, id_user: id_user, nama, npwp } = props

    // States
    const [open, setOpen] = useState(false)

    // Extract onClick from elementProps
    const { onClick: elementOnClick, ...restElementProps } = elementProps

    // Handle onClick event
    const handleOnClick = (e: MouseEvent) => {
        elementOnClick && elementOnClick(e)
        setOpen(true)
    }

    return (
        <>
            {/* Receive element component as prop and we will pass onclick event which changes state to open */}
            <Element onClick={handleOnClick} {...restElementProps} />
            {/* Receive dialog component as prop and we will pass open and setOpen props to that component */}
            <Dialog open={open} setOpen={setOpen} {...dialogProps} id_user={id_user} nama={nama} npwp={npwp} />
        </>
    )
}

export default OpenDialogRejectUser
