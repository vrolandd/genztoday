import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-sm space-y-4">
        <div>
          <h1 className="font-medium text-4xl">Hi!</h1>
          <p className="text-muted-foreground text-sm my-2">
            It&apos;s nice to see you here. Please choose a username to continue.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
