"use client";

import { useState } from "react";
import { authActions } from "@/store/auth";
import { useDispatch } from "react-redux";
import { UserInfo } from "@/db/schema";
import { useRouter } from "next/navigation";

// todo: not allowable to logged in users
// todo: fetch states
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  function login(userInfo: UserInfo) {
    dispatch(authActions.login(userInfo));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");

    const response = await fetch("/api/authorize/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 404) {
      setErrorMessage("Email not registered yet");
      return;
    }
    if (response.status === 401) {
      setErrorMessage("Wrong password");
      return;
    }

    const json = await response.json();

    login({ email: json.email, id: json.id });
    router.push("/my-cinemas");
  }

  function handleEmailChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setPassword(e.target.value);
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Login
      </h2>
      {errorMessage && (
        <div className="block mb-2 bg-red-500">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
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
            value={email}
            placeholder="you@example.com"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            onChange={handleEmailChange}
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
            value={password}
            placeholder="********"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 focus:outline-none focus:shadow-outline"
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
