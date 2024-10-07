'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { CircularProgress, IconButton, InputAdornment } from '@mui/material'

import { useForm } from 'react-hook-form'
import { AxiosError } from 'axios'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

// Custom Hook
import useLoading from '@/hooks/useLoading'
import { useRefreshToken } from '@/hooks/useRefreshToken'

// Service Imports
import { getUserById, updateUser } from '@/service/user'

type EditUserCardData = {
  badgeColor?: ThemeColor
}

type EditUserCardProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: EditUserCardData
  id_user: string
  refreshData: () => void
}

const initialCardData: EditUserCardProps['data'] = {
  badgeColor: 'primary'
}

const EditUserCard = ({ open, setOpen, data, id_user, refreshData }: EditUserCardProps) => {
  const { loading, withLoading } = useLoading()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cardData, setCardData] = useState(initialCardData)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [user, setUser] = useState<any>(null)
  const refreshUserToken = useRefreshToken

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleClose = () => {
    setOpen(false)
    setCardData(initialCardData)
  }

  const { handleSubmit, reset, register, formState: { errors } } = useForm({
    defaultValues: {
      id_user: '',
      npwp: '',
      nama: '',
      password: '',
      file: null
    }
  });


  useEffect(() => {
    const fetchUserById = async (id_user: string) => {
      try {
        const response = await getUserById(id_user)

        if (response.code === 200) {
          setUser(response.data)

          reset({
            id_user: response.data.id_user,
            npwp: response.data.npwp,
            nama: response.data.nama,
            password: '',
            file: null
          })
        }

      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error("Gagal menghubungkan ke server")
        } else {
          toast.error('Terjadi kesalahan')
        }
      }
    }

    fetchUserById(id_user)

  }, [id_user, reset])

  // npwp input mask must be 16 digit
  const npwpInputMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const npwp = value.replace(/\D/g, '');

    e.target.value = npwp.slice(0, 16);
  }

  const onSubmit = async (val: any) => {
    await withLoading(async () => {
      const tokenRefreshed = await refreshUserToken()

      if (!tokenRefreshed) return;

      try {
        const response = await updateUser({
          id_user: user?.id_user || '',
          npwp: val.npwp || '',
          nama: val.nama || '',
          password: val.password || '',
          file: val.file || null
        });

        if (response.code === 200) {
          toast.success(response.message);
          refreshData();
          setOpen(false);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error("Gagal menghubungkan ke server");
        } else {
          toast.error('Terjadi kesalahan');
        }
      }
    })
  }

  const validateFile = (file: File | null) => {
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        return 'Format file tidak valid';
      }

      if (file.size > 3 * 1024 * 1024) {
        return 'Ukuran file tidak boleh lebih dari 3MB';
      }
    }

    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;

    return passwordRegex.test(password) || 'Password harus terdiri dari alfabet, angka, karakter khusus, huruf kecil dan huruf besar';
  };

  useEffect(() => {
    setCardData(data ?? initialCardData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='p-6 sm:pbs-8 sm:pbe-6 sm:pli-8'>
        User
        <Typography component='span' className='flex flex-col'>
          Edit User
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <DialogContent className='overflow-visible pbs-0 p-6 sm:pli-8 space-y-1'>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <Typography variant='h6' className='mb-4'>
                NPWP
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='NPWP'
                {...register('npwp', {
                  minLength: { value: 16, message: 'NPWP harus 16 digit' },
                  onChange: npwpInputMask
                })}
                error={!!errors.npwp}
                helperText={errors.npwp ? errors.npwp.message : ''}
              />
            </Grid>
          </Grid>

          <Grid container spacing={6}>
            <Grid item xs={6}>
              <Typography variant='h6' className='mb-4'>
                Nama
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Nama Perusahaan'
                {...register('nama', {
                  minLength: { value: 3, message: 'Nama minimal harus 3 karakter' }
                })}
                error={!!errors.nama}
                helperText={errors.nama ? errors.nama.message : ''}
              />
            </Grid>
          </Grid>

          <Grid container spacing={6}>
            <Grid item xs={6}>
              <Typography variant='h6' className='mb-4'>
                Password
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Password'
                type={isPasswordShown ? 'text' : 'password'}
                {...register('password', {
                  validate: validatePassword
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
              />
            </Grid>
          </Grid>

          <Grid container spacing={6}>
            <Grid item xs={6}>
              <Typography variant='h6' className='mb-4'>
                File Badan/Perorangan
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                type='file'
                InputProps={{
                  readOnly: true
                }}
                {...register('file', {
                  validate: validateFile
                })}
                error={!!errors.file}
                helperText={errors.file ? errors.file.message : ''}
              />
              <Typography className='text-xs italic text-[#B81118]'>*File harus berformat PNG, JPEG, JPG</Typography>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className='flex justify-start pbs-0 p-6 sm:pbe-8 sm:pli-8'>
          <Button fullWidth variant='contained' type='submit' disabled={loading}>
            {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Simpan'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditUserCard
