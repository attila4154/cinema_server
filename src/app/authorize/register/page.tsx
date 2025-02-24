"use client";

import { useActionState } from "react";
import { SubmitButton } from "../login/page";
import { submitRegisterForm } from "./action";

// todo: not allowable to logged in users
// todo: fetch states
// todo: move to server function
export default function RegisterPage() {
  const [state, formAction] = useActionState(
    submitRegisterForm,
    null
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Register
      </h2>
      {state?.error && (
        <div className="bg-red-500 p-2 rounded-md">
          {state.error}
        </div>
      )}
      <form action={formAction}>
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
            id="password"
            name="password"
            placeholder="********"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}
