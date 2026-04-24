---
name: react-hook-form-and-tanstack-query
description: >-
  Restricts client-side forms to react-hook-form and server/async state to
  TanStack Query (react-query). Use when implementing forms, mutations, queries,
  caching, or data fetching in React, or when the user mentions Formik, SWR,
  axios-only data layers, useEffect-fetch patterns, or other form/data libraries.
---

# react-hook-form and TanStack Query only

## Forms

- **Use** [react-hook-form](https://react-hook-form.com/) for all form state, validation integration, and submit handling in React.
- **Do not** introduce or suggest Formik, Final Form, uncontrolled-only stacks used as a form framework, or other form libraries unless the user explicitly overrides this rule for a migration.

## Data fetching and async server state

- **Use** [TanStack Query](https://tanstack.com/query) (`@tanstack/react-query`) for queries, mutations, caching, invalidation, and loading/error states tied to server data.
- **Do not** introduce SWR, Relay (unless already in repo), ad-hoc `useEffect` + `fetch` patterns as the primary data layer, or parallel client data libraries for the same concerns.

## Combined usage

- Wire form submissions to TanStack Query `useMutation` where the submit action is remote; keep field-level logic in react-hook-form.
- Prefer query keys and cache updates consistent with existing project patterns when adding new endpoints.

## Examples

### Provider (App Router)

Wrap client trees that use queries/mutations once (e.g. in `app/providers.tsx`):

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

### Form-only (react-hook-form)

```tsx
"use client";

import { useForm } from "react-hook-form";

type FormValues = { email: string };

export function SubscribeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { email: "" } });

  const onSubmit = handleSubmit(async (data) => {
    // call API or mutation trigger here
    console.log(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        aria-invalid={!!errors.email}
        {...register("email", { required: "Email is required" })}
      />
      {errors.email && <p role="alert">{errors.email.message}</p>}
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

### Query (TanStack Query)

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchProfile(): Promise<{ name: string }> {
  const res = await fetch("/api/profile");
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}

export function Profile() {
  const { data, error, isPending } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  if (isPending) return <p>Loading…</p>;
  if (error) return <p role="alert">{(error as Error).message}</p>;
  return <p>{data?.name}</p>;
}
```

### Form + mutation (react-hook-form + `useMutation`)

```tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

type FormValues = { title: string };

async function createPost(body: FormValues) {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Could not create post");
  return res.json();
}

export function NewPostForm() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: { title: "" },
  });

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values, {
      onSuccess: () => reset(),
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <input {...register("title", { required: true })} />
      {mutation.isError && (
        <p role="alert">{(mutation.error as Error).message}</p>
      )}
      <button type="submit" disabled={formState.isSubmitting || mutation.isPending}>
        Save
      </button>
    </form>
  );
}
```
