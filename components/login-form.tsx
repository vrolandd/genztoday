"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "./ui/input"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

const AuthSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
})

export function LoginForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(AuthSchema),
    defaultValues: { username: "" },
    mode: "onSubmit"
  })

  const onSubmit = handleSubmit(async ({ username }) => {
    const res = await signIn("credentials", {
      username: username.trim(),
      redirect: false,
    })

    if (res?.error) {
      setFormError("username", { message: "This account is already taken." })
      return
    }

    router.push("/")
    router.refresh()
  })

  return (
    <form onSubmit={onSubmit} className="max-w-sm">
      <FieldGroup>
        <Field data-invalid={!!errors.username}>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            autoComplete="username"
            aria-invalid={!!errors.username}
            {...register("username")}
          />
          <FieldError
            errors={errors.username ? [errors.username] : undefined}
          />
        </Field>
        <FieldError errors={errors.root ? [errors.root] : undefined} />
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
