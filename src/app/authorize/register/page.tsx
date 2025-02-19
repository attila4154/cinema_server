"use client";

import { useState } from "react";

// // todo: not allowalbe to logged in users
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");

    const response = await fetch(
      "/api/authorize/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const json = await response.json();
    if (
      response.status >= 400 &&
      json.error === "customer_exists"
    ) {
      setErrorMessage(json.errorMessage);
    }
    console.log(json);
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
        Register
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

// import { FormEvent } from "react";

// export default function Page() {
//   async function onSubmit(
//     event: FormEvent<HTMLFormElement>
//   ) {
//     event.preventDefault();

//     const formData = new FormData(event.currentTarget);
//     const response = await fetch("/api/submit", {
//       method: "POST",
//       body: formData,
//     });

//     // Handle response if necessary
//     const data = await response.json();
//     // ...
//   }

//   return (
//     <form onSubmit={onSubmit}>
//       <input type="text" name="name" />
//       <button type="submit">Submit</button>
//     </form>
//   );
// }
