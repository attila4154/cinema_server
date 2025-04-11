"use client";

import { SubmitButton } from "@/app/components/SubmitButton";
import Link from "next/link";
import { useActionState } from "react";
import { submitRegisterForm } from "./action";

// todo: not allowable to logged in users
// todo: fetch states
// todo: mb unify for login and register?
export default function RegisterPage() {
  const [state, formAction] = useActionState(
    submitRegisterForm,
    null
  );

  return (
    <main className="flex items-center md:pt-[84px] pt-[60px] w-[100vw] h-[100vh] flex-col">
      <h2 className="text-2xl font-bold mb-6 text-left">
        Register
      </h2>
      <form action={formAction} className="md:w-96 w-4/5">
        {state?.error && (
          <div className="bg-red-500 p-2 rounded-md mb-3">
            {state.error}
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={state?.email}
            placeholder="you@example.com"
            className="border rounded py-2 px-3 focus:outline-none focus:shadow-outline border-[#3c3f43] w-full"
            required
          />
        </div>
        <div>
          <label
            className="block text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="********"
            className="shadow border rounded w-full py-2 px-3 mb-3 focus:outline-none focus:shadow-outline border-[#3c3f43]"
            required
          />
        </div>
        <Link
          href="/authorize/login"
          className="underline"
        >
          Or login
        </Link>
        <SubmitButton />
      </form>
    </main>
  );
}
