"use client";
import { COLOR_PRIMARY } from "@/app/global";
import { SearchBar } from "../SearchBar";
import { FilterButton } from "./FilterButton";
import { MenuButton } from "./MenuButton";

export function Header({
  onSearch,
  children,
}: {
  onSearch: (q: string) => void;
  children: React.ReactNode;
}) {
  return (
    <header
      className={`z-[3] grid md:grid-cols-subgrid md:col-span-3 items-center md:pb-5 pb-2 md:pt-5 pt-2 grid-cols-[1fr_3fr_1fr] sticky top-0 ${COLOR_PRIMARY}`}
    >
      <div className="flex items-center h-full justify-center md:justify-start md:pl-4">
        <MenuButton />
      </div>
      <SearchBar onSearch={onSearch} />
      <div className="md:hidden flex items-center h-full justify-center">
        <FilterButton>{children}</FilterButton>
      </div>
    </header>
  );
}
