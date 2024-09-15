import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters')
})

export const uploadBuktiPotongFormSchema = z.object({
  periode: z.date(),
  file: z.any().refine(file => file instanceof File || file === null, {
    message: 'File harus diunggah'
  })
})

export const createUserFormSchema = z.object({
  npwp: z.string().refine(data => data.length === 16, { message: 'NPWP harus terdiri dari 16 digit' }),
  nama: z.string().min(3, 'Nama minimal harus terdiri dari 3 karakter'),
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  photo: z.string().refine(data => data.endsWith('.jpg') || data.endsWith('.png'), {
    message: 'File Badan/Perorangan harus berformat JPG atau PNG'
  })
})

export const profileFormSchema = z
  .object({
    npwp: z.string().refine(data => data.length === 16, { message: 'NPWP harus terdiri dari 16 digit' }),
    nama: z.string().min(3, 'Nama minimal harus terdiri dari 3 karakter'),
    email: z.string().email({ message: 'Alamat email tidak valid' }),
    password: z
      .string()
      .min(6, 'Password minimal harus terdiri dari 6 karakter')
      .refine(data => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(data), {
        message: 'Password harus terdiri dari alfabet, angka, karakter khusus, huruf kecil dan huruf besar'
      }),
    confirmPassword: z.string().refine(data => data.length > 0, { message: 'Konfirmasi password wajib diisi' }),
    photo: z.string().refine(data => data.endsWith('.jpg') || data.endsWith('.png'), {
      message: 'Foto harus berformat JPG atau PNG'
    })
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Password dan konfirmasi password harus sama'
      })
    }
  })

export const rejectUserFormSchema = z.object({
  keterangan: z.string().min(3, 'Keterangan minimal harus terdiri dari 3 karakter')
})
