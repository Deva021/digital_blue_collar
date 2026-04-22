import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
          <div className="text-center text-sm text-muted-foreground">
            <Link href="/forgot-password" className="hover:text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">
             Don't have an account?{' '}
            <Link href="/signup" className="hover:text-primary hover:underline text-primary">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
