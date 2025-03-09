"use client";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/authorize/logout");
    // todo: this doesn't refresh cinema list, I guess I need to implement server functions
    window.location.reload();
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
