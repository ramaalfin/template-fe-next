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

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { createUserFormSchema } from '@/lib/form-schema'

// Custom Hook
import useLoading from '@/hooks/useLoading'
import { useRefreshToken } from '@/hooks/useRefreshToken'

// Service Imports
import { createUser } from '@/service/user'

type CreateUserCardData = {
  badgeColor?: ThemeColor
}

type CreateUserCardProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: CreateUserCardData
  refreshData: () => void
}

const initialCardData: CreateUserCardProps['data'] = {
  badgeColor: 'primary'
}

const CreateUserCard = ({ open, setOpen, data, refreshData }: CreateUserCardProps) => {
  const { loading, withLoading } = useLoading()
  const refreshUserToken = useRefreshToken
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cardData, setCardData] = useState(initialCardData)
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const handleClose = () => {
    setOpen(false)
    setCardData(initialCardData)
  }

  // Form
  const form = useForm({
    defaultValues: {
      npwp: '',
      nama: '',
      email: '',
      password: '',
      file: undefined as unknown as File
    },
    resolver: zodResolver(createUserFormSchema)
  });

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // npwp input mask must be 16 digit
  const npwpInputMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const npwp = value.replace(/\D/g, '');

    e.target.value = npwp.slice(0, 16);
  }

  const onSubmit = async (val: z.infer<typeof createUserFormSchema>) => {
    await withLoading(async () => {
      const tokenRefreshed = await refreshUserToken()

      if (!tokenRefreshed) return;

      try {
        const response = await createUser(val);

        if (response.code === 200) {
          toast.success(response.message);
          form.reset();
          setOpen(false)

          refreshData();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Gagal menghubungkan ke server");
      }
    })
  }

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
          Create New
        </Typography>
      </DialogTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <DialogContent className='overflow-visible pbs-0 p-6 sm:pli-8 space-y-1'>
            <Grid container spacing={6}>
              <Grid item xs={6}>
                <Typography variant='h6' className='mb-4'>
                  NPWP
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FormField
                  control={form.control}
                  name="npwp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField autoFocus fullWidth placeholder='Enter your NPWP' {...field} onChange={(e) => { npwpInputMask(e as React.ChangeEvent<HTMLInputElement>); field.onChange(e); }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField autoFocus fullWidth placeholder='Enter your Nama' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={6}>
              <Grid item xs={6}>
                <Typography variant='h6' className='mb-4'>
                  Email
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField autoFocus fullWidth placeholder='Enter your email' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField
                          fullWidth
                          placeholder='············'
                          id='outlined-adornment-password'
                          type={isPasswordShown ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                                  <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                <FormField
                  control={form.control}
                  name="file"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField
                          autoFocus
                          fullWidth
                          type='file'
                          InputProps={{
                            readOnly: true,
                          }}
                          {...fieldProps}
                          onChange={(event) => {
                            const file = (event.target as HTMLInputElement).files?.[0] || null;

                            onChange(file);
                          }}
                        />
                      </FormControl>
                      <Typography className='text-xs italic text-[#B81118]'>*File harus berformat PNG, JPEG, JPG</Typography>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions className='flex justify-start pbs-0 p-6 sm:pbe-8 sm:pli-8'>
            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Simpan'}
            </Button>
          </DialogActions>
        </form>
      </Form>
    </Dialog>
  )
}

export default CreateUserCard
