"use client";
// todo: not allowable to logged in users

import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitLoginForm } from "./loginAction";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
      disabled={pending}
    >
      {pending ? (
        <Image
          src="/loading.gif"
          alt=""
          width={28}
          height={28}
        />
      ) : (
        "Submit"
      )}
    </button>
  );
}

// todo: fetch states
export default function LoginPage() {
  const [state, formAction] = useActionState(
    submitLoginForm,
    null
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Login
      </h2>
      <form action={formAction}>
        {state?.error && (
          <div className="bg-red-500 p-2 rounded-md">
            {state.error}
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            // defaultValue={state}
            // value={state?.data?.email}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="********"
            // value={state?.data?.password}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}
