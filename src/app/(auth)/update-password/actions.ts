'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export async function updatePasswordAction(prevState: any, formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const parsed = updatePasswordSchema.safeParse({ password, confirmPassword })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: null }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message, success: null }
  }

  return { error: null, success: 'Your password has been updated successfully.' }
}
