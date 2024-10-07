'use client'

// React Imports
import { useState } from 'react'
import type { ComponentType } from 'react'

type OpenDialogCreateUserProps = {
  element: ComponentType<any>
  dialog: ComponentType<any>
  elementProps?: any
  dialogProps?: any
  refreshData?: () => void
}

const OpenDialogCreateUser = (props: OpenDialogCreateUserProps) => {
  // Props
  const { element: Element, dialog: Dialog, elementProps, dialogProps, refreshData } = props

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
      <Dialog open={open} setOpen={setOpen} {...dialogProps} refreshData={refreshData} />
    </>
  )
}

export default OpenDialogCreateUser
