import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters')
})

export const uploadBuktiPotongFormSchema = z.object({
  vendor: z.string().nonempty('Vendor wajib diisi'),
  tahun: z.string().nonempty('Tahun wajib diisi'),
  bulan: z.string().nonempty('Bulan wajib diisi'),
  photo: z
    .string()
    .nonempty('Bukti potong wajib diisi')
    .refine(data => data.endsWith('.jpg') || data.endsWith('.png'), {
      message: 'Bukti potong harus berformat JPG atau PNG'
    })
})

export const createUserFormSchema = z.object({
  npwp: z
    .string()
    .nonempty('NPWP wajib diisi')
    .refine(data => data.length === 16, { message: 'NPWP harus terdiri dari 16 digit' }),
  nama: z.string().nonempty('Nama wajib diisi').min(3, 'Nama minimal harus terdiri dari 3 karakter'),
  email: z.string().nonempty('Email wajib diisi').email({ message: 'Alamat email tidak valid' }),
  photo: z
    .string()
    .nonempty('File Badan/Perorangan wajib diisi')
    .refine(data => data.endsWith('.jpg') || data.endsWith('.png'), {
      message: 'File Badan/Perorangan harus berformat JPG atau PNG'
    })
})
