import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z.string({ required_error: 'Email wajib diisi' }).email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password wajib diisi' }).min(6, 'Password must be at least 6 characters')
})

export const registerFormSchema = z
  .object({
    npwp: z
      .string({ required_error: 'NPWP wajib diisi' })
      .refine(data => data.length === 16, { message: 'NPWP harus terdiri dari 16 digit' }),

    nama: z.string({ required_error: 'Nama wajib diisi' }).min(3, 'Nama minimal harus terdiri dari 3 karakter'),
    email: z.string({ required_error: 'Email wajib diisi' }).email({ message: 'Alamat email tidak valid' }),
    password: z
      .string({ required_error: 'Password wajib diisi' })
      .min(6, 'Password minimal harus terdiri dari 6 karakter')
      .refine(data => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(data), {
        message: 'Password harus terdiri dari alfabet, angka, karakter khusus, huruf kecil dan huruf besar'
      }),
    confirmPassword: z.string({ required_error: 'Konfirmasi password wajib diisi' }),
    photo: z
      .string({ required_error: 'Foto wajib diisi' })
      .refine(data => data.endsWith('.jpg') || data.endsWith('.png'), {
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
