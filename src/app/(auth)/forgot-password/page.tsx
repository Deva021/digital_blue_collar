import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
          <CardDescription>Enter your email to receive a recovery link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ForgotPasswordForm />
          <div className="text-center text-sm text-muted-foreground mt-4">
            Remembered your password?{' '}
            <Link href="/login" className="hover:text-primary hover:underline text-primary">
              Return to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
