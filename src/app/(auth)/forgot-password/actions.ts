'use server'

import { createClient } from '@/lib/supabase/server'
import { forgotPasswordSchema } from '@/lib/validations/auth'
import { getURL } from '@/lib/utils'

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string

  const parsed = forgotPasswordSchema.safeParse({ email })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: null }
  }

  const supabase = await createClient()
  const baseUrl = getURL()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}auth/callback?next=/update-password`,
  })

  if (error) {
    return { error: error.message, success: null }
  }

  return { error: null, success: 'If an account exists, a password reset email has been sent.' }
}
