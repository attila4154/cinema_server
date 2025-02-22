"use client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/authorize/logout");
    // todo: this doesn't refresh cinema list, I guess I need to implement server functions
    router.refresh();
  }

  return (
    <button
      className="bg-slate-200 rounded-md p-2"
      onClick={logout}
    >
      Logout
    </button>
  );
}
