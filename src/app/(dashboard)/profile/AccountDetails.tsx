'use client'

// React Imports
import { useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import type { SelectChangeEvent } from '@mui/material/Select'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { profileFormSchema } from '@/lib/form-schema'
import { IconButton, InputAdornment } from '@mui/material'

type Data = {
  npwp: string
  nama: string
  email: string
  password: string
  confirmPassword: string
  photo: string
}

// Vars
const initialData: Data = {
  npwp: '1234567890123456',
  nama: 'John',
  email: 'john.doe@example.com',
  password: 'password',
  confirmPassword: 'password',
  photo: ''
}

const AccountDetails = () => {
  // States
  const [formData, setFormData] = useState<Data>(initialData)
  const [fileInput, setFileInput] = useState<string>('')
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleFileInputChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setFileInput(reader.result as string)
      }
    }
  }

  const handleFileInputReset = () => {
    setFileInput('')
    setImgSrc('/images/avatars/1.png')
  }

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const form = useForm({
    defaultValues: {
      npwp: '',
      nama: '',
      email: '',
      password: '',
      confirmPassword: '',
      photo: ''
    },
    resolver: zodResolver(profileFormSchema)
  });

  // npwp input mask must be 16 digit
  const npwpInputMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const npwp = value.replace(/\D/g, '');

    e.target.value = npwp.slice(0, 16);
  }

  const onSubmit = (val: z.infer<typeof profileFormSchema>) => {
    console.log(val);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className='mbe-4'>
            <div className='flex max-sm:flex-col items-center gap-6'>
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem className='flex gap-4 items-center'>
                    <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
                    <div className='flex flex-grow flex-col gap-4'>
                      <div className='flex flex-col sm:flex-row gap-4'>
                        <Button component='label' variant='contained' htmlFor='account-settings-upload-image'>
                          Upload New Photo
                          <input
                            hidden
                            type='file'
                            value={fileInput}
                            name='photo'
                            accept='image/png, image/jpeg'
                            onChange={handleFileInputChange}
                            id='account-settings-upload-image'
                          />
                        </Button>
                        <Button variant='tonal' color='secondary' onClick={handleFileInputReset}>
                          Reset
                        </Button>
                      </div>
                      <Typography>Allowed JPG and PNG. Max size of 800K</Typography>

                      {/* error message */}
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <FormField
                  control={form.control}
                  name="npwp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField autoFocus fullWidth label='NPWP' placeholder='Masukkan NPWP' {...field} onChange={(e) => { npwpInputMask(e); field.onChange(e); }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField autoFocus fullWidth label='Nama Perusahaan' placeholder='Masukkan Nama Perusahaan' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField autoFocus fullWidth label='Email' placeholder='Masukkan email' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField
                          fullWidth
                          label='Password'
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
                      <p className='text-xs italic text-[#B81118]'>*Password harus terdiri dari alfabet, angka, karakter khusus, huruf kecil dan huruf besar</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField
                          fullWidth
                          label='Konfirmasi Password'
                          placeholder='············'
                          id='outlined-adornment-password'
                          type={isConfirmPasswordShown ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton edge='end' onClick={handleClickShowConfirmPassword} onMouseDown={e => e.preventDefault()}>
                                  <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
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
              <Grid item xs={12} className='flex gap-4 flex-wrap'>
                <Button variant='contained' type='submit'>
                  Save Changes
                </Button>
                <Button variant='tonal' type='reset' color='secondary' onClick={() => setFormData(initialData)}>
                  Reset
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </Form >
  )
}

export default AccountDetails
