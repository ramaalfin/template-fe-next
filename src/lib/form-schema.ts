import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const loginFormSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters')
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
    newPassword: z
      .string()
      .min(6, 'Password minimal harus terdiri dari 6 karakter')
      .refine(data => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(data), {
        message: 'Password harus terdiri dari alfabet, angka, karakter khusus, huruf kecil dan huruf besar'
      }),
    confirmPassword: z.string().refine(data => data.length > 0, { message: 'Konfirmasi password wajib diisi' })
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Password baru dan konfirmasi password harus sama'
      })
    }
  })

export const createUserFormSchema = z.object({
  npwp: z.string().refine(data => data.length === 16, { message: 'NPWP harus terdiri dari 16 digit' }),
  nama: z.string().min(3, 'Nama minimal harus terdiri dari 3 karakter'),
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  password: z
    .string()
    .min(6, 'Password minimal harus terdiri dari 6 karakter')
    .refine(data => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(data), {
      message: 'Password harus terdiri dari alfabet, angka, karakter khusus, huruf kecil dan huruf besar'
    }),
  file: zfd
    .file()
    .refine(file => file.size < 3 * 1024 * 1024, {
      message: 'Ukuran file tidak boleh lebih dari 3MB'
    })
    .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), {
      message: 'Format file tidak valid'
    })
})

export const editUserFormSchema = z.object({
  npwp: z.string().refine(data => data.length === 16, { message: 'NPWP harus terdiri dari 16 digit' }),
  nama: z.string().min(3, 'Nama minimal harus terdiri dari 3 karakter'),
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  password: z
    .string()
    .min(6, 'Password minimal harus terdiri dari 6 karakter')
    .refine(data => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(data), {
      message: 'Password harus terdiri dari alfabet, angka, karakter khusus, huruf kecil dan huruf besar'
    }),
  file: zfd
    .file()
    .refine(file => file.size < 3 * 1024 * 1024, {
      message: 'Ukuran file tidak boleh lebih dari 3MB'
    })
    .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), {
      message: 'Format file tidak valid'
    })
})

export const createParametertFormSchema = z.object({
  parameter: z
    .string()
    .min(3, 'Parameter minimal harus terdiri dari 3 karakter')
    .refine(data => !data.includes(' '), {
      message: 'Parameter tidak boleh mengandung spasi'
    }),
  deskripsi: z.string().min(3, 'Deskripsi minimal harus terdiri dari 3 karakter'),
  nilai: z.string(),
  nilai_html: z.string()
})

export const updateParameterFormSchema = z.object({
  deskripsi: z.string().min(3, 'Deskripsi minimal harus terdiri dari 3 karakter'),
  parameter: z
    .string()
    .min(3, 'Parameter minimal harus terdiri dari 3 karakter')
    .refine(data => !data.includes(' '), {
      message: 'Parameter tidak boleh mengandung spasi'
    }),
  nilai: z
    .string()
    .nullable()
    .transform(value => value ?? ''),
  nilai_html: z.string()
})
