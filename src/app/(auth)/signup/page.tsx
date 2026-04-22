import { SignupForm } from '@/components/auth/signup-form'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your email and password to sign up</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignupForm />
          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link href="/login" className="hover:text-primary hover:underline text-primary">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
