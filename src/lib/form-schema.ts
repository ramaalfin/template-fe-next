import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'Alamat Email tidak valid' }),
  password: z.string().min(6, 'Password minimal harus terdiri dari 6 karakter')
})

export const uploadBuktiPotongFormSchema = z.object({
  vendor: z.string().refine(data => data.length > 0, { message: 'Vendor wajib diisi' }),
  tahun: z.string().refine(data => data.length > 0, { message: 'Tahun wajib diisi' }),
  bulan: z.string().refine(data => data.length > 0, { message: 'Bulan wajib diisi' }),
  photo: z
    .string()
    .refine(data => data.endsWith('.jpg') || data.endsWith('.png'), {
      message: 'Bukti potong harus berformat JPG atau PNG'
    })
})

export const createUserFormSchema = z.object({
  npwp: z
    .string()
    .refine(data => data.length === 16, { message: 'NPWP harus terdiri dari 16 digit' }),
  nama: z.string().min(3, 'Nama minimal harus terdiri dari 3 karakter'),
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  photo: z
    .string()
    .refine(data => data.endsWith('.jpg') || data.endsWith('.png'), {
      message: 'File Badan/Perorangan harus berformat JPG atau PNG'
    })
})
