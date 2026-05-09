'use server'

import { createClient } from '@/lib/supabase/server'
import { signupSchema } from '@/lib/validations/auth'
import { getURL } from '@/lib/utils'

export async function signupAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const parsed = signupSchema.safeParse({ email, password, confirmPassword })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: null }
  }

  const supabase = await createClient()
  const baseUrl = getURL()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${baseUrl}auth/callback?next=/dashboard`,
    },
  })

  if (error) {
    return { error: error.message, success: null }
  }

  return { error: null, success: 'A verification link has been sent to your email address. Please click it to activate your account.' }
}
