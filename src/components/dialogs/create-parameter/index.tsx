'use client'

// React Imports
import { useState } from 'react'

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { CircularProgress } from '@mui/material'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { createParametertFormSchema } from '@/lib/form-schema'

// Custom Hook
import useLoading from '@/hooks/useLoading'
import { useRefreshToken } from '@/hooks/useRefreshToken';

// Service Imports
import { createParameter } from '@/service/parameters'

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

type CreateParameterCardProps = {
  open: boolean
  setOpen: (open: boolean) => void
  refreshData: () => void
}

const CreateParameterCard = ({ open, refreshData, setOpen }: CreateParameterCardProps) => {
  const { loading, withLoading } = useLoading()
  const [content, setContent] = useState('');
  const refreshUserToken = useRefreshToken

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      [{ align: [] }],
      [{ color: [] }],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'align',
    'color',
  ];

  const handleEditorChange = (newContent: any) => {
    setContent(newContent);
  };

  const handleClose = () => {
    setOpen(false)
  }

  // Form
  const form = useForm({
    defaultValues: {
      parameter: '',
      deskripsi: '',
      nilai: '',
      nilai_html: '',
    },
    resolver: zodResolver(createParametertFormSchema)
  });

  const onSubmit = async (val: z.infer<typeof createParametertFormSchema>) => {
    if (!content && !val.nilai) {
      return toast.error('Nilai atau Nilai HTML tidak boleh kosong');
    }

    await withLoading(async () => {
      const tokenRefreshed = await refreshUserToken()

      if (!tokenRefreshed) return;

      try {
        const response = await createParameter({
          parameter: val.parameter,
          deskripsi: val.deskripsi,
          nilai: val.nilai,
          nilai_html: content
        });

        if (response.code === 200) {
          toast.success(response.message);
          form.reset()
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

  return (
    <Dialog open={open} onClose={handleClose} sx={{
      '& .MuiDialog-paper': { overflow: 'visible' },
      '& .MuiPaper-root': { maxWidth: 800, },
      width: '100%',
    }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='p-6 sm:pbs-8 sm:pbe-6 sm:pli-8'>
        Parameter
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
                  Deskripsi
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FormField
                  control={form.control}
                  name="deskripsi"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField autoFocus fullWidth placeholder='Enter your deskripsi' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Grid>
            </Grid>

            {/* text input for parameter */}
            <Grid container spacing={6}>
              <Grid item xs={6}>
                <Typography variant='h6' className='mb-4'>
                  Parameter
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FormField
                  control={form.control}
                  name="parameter"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField fullWidth placeholder='Enter your parameter' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Grid>
            </Grid>

            {/* text area for nilai */}
            <Grid spacing={6}>
              <div className="">
                <Typography variant='h6' className='mb-4'>
                  Nilai
                </Typography>
                <FormField
                  control={form.control}
                  name="nilai"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextField
                          multiline
                          fullWidth
                          rows={4}
                          placeholder='Enter your nilai'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Grid>

            {/* text area for nilai_html */}
            <Grid container spacing={6}>
              <div className="pl-6 pt-6">
                <Typography variant='h6' className='mb-4'>
                  Nilai HTML
                </Typography>
                <FormField
                  control={form.control}
                  name="nilai_html"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <QuillEditor
                          value={content}
                          onChange={handleEditorChange}
                          modules={quillModules}
                          formats={quillFormats}
                          className="w-full h-[70%] bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

export default CreateParameterCard
