import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'Alamat Email tidak valid' }),
  password: z.string().min(6, 'Password minimal harus terdiri dari 6 karakter')
})

export const registerFormSchema = z
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

export const dashboardFormSchema = z.object({
  tahun: z.string().refine(data => data.length === 4, { message: 'Tahun wajib diisi' })
})
