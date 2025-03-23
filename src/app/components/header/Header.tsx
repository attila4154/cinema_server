"use client";
import { SearchBar } from "../SearchBar";
import { FilterButton } from "./FilterButton";
import { MenuButton } from "./MenuButton";

export function Header({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) {
  // const authState = await getAuthState();
  return (
    <header className="grid md:grid-cols-subgrid md:col-span-3 items-center md:mb-5 mb-2 md:mt-5 mt-2 grid-cols-[1fr_3fr_1fr]">
      <div className="flex items-center h-full justify-center md:justify-start md:pl-4">
        <MenuButton />
      </div>
      <SearchBar onSearch={onSearch} />
      <div className="md:hidden flex items-center h-full justify-center">
        <FilterButton />
      </div>
    </header>
  );
}
