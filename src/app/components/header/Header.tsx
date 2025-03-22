"use client";
import { SearchBar } from "../SearchBar";
import { Menu } from "./MenuButton";

export function Header({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) {
  // const authState = await getAuthState();
  return (
    <header className="grid grid-cols-subgrid col-span-3 items-center">
      <Menu />
      <SearchBar onSearch={onSearch} />
      <div></div>
    </header>
  );
}
