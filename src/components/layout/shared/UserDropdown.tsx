'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify'
import { deleteCookie, getCookie } from 'cookies-next'

import { logout } from '@/service/auth'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Custom Hook
import useLoading from '@/hooks/useLoading';

import Link from '@/components/Link'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  const { loading, withLoading } = useLoading()

  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()

  const { settings } = useSettings()

  const userData = getCookie('user-admin')
  const tokenData = getCookie('token-admin')

  const user = userData ? JSON.parse(userData as string) : null
  const token = tokenData ? JSON.parse(tokenData as string) : null

  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)

  useEffect(() => {
    setName(user?.nama)
    setEmail(user?.email)
  }, [user])

  useEffect(() => {
    if (user?.photo) {
      setPhoto(`data:image/jpg;base64,${user.foto}`)
    } else {
      setPhoto('/images/avatars/nophoto.jpg')
    }
  }, [user])

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    if (!token.access.token) {
      return
    }

    await withLoading(async () => {
      try {
        const res = await logout(token.access.token)

        if (res && res?.code !== 200) {
          toast.error(res?.message)

          return
        } else {
          deleteCookie('user-admin')
          deleteCookie('token-admin')

          router.push('/login')
        }
      } catch (error) {
        toast.error('Terjadi kesalahan')
      }
    })
  }

  return (
    <>
      <ToastContainer />

      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          ref={anchorRef}
          alt={name || undefined}
          src={photo ?? '/images/avatars/nophoto.jpg'}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    <Avatar
                      alt={name ?? undefined}
                      src={photo ?? '/images/avatars/nophoto.jpg'}
                    />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {name}
                      </Typography>
                      <Typography variant='caption'>{email}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='tabler-user' />
                    <Link href='/profile'>
                      <Typography color='text.primary'>My Profile</Typography>
                    </Link>
                  </MenuItem>
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Logout'}
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
