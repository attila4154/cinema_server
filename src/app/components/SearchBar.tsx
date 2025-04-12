import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "../util/util";

function DeleteQueryButton({
  handleClick,
}: {
  handleClick: () => void;
}) {
  return (
    <button
      onClick={handleClick}
      className={`hover:bg-zinc-900 rounded-md transition-all`}
    >
      <Image
        src="/cross.svg"
        height={35}
        width={35}
        alt=""
      />
    </button>
  );
}

export function SearchBar({
  onSearch,
}: {
  onSearch: (s: string) => void;
}) {
  const [query, setQuery] = useState("");
  const debounceSearch = useMemo(
    () =>
      debounce((query: string) => {
        onSearch(query);
      }, 200),
    [onSearch]
  );

  // todo: shoulnd't run on the first render
  useEffect(() => {
    debounceSearch(query);
  }, [query, debounceSearch]);

  const handleSearch = (query: string) => {
    setQuery(query);
  };

  const handleDeleteQuery = () => {
    if (query === "") return;
    setQuery("");
  };

  return (
    <div className="flex items-center bg-[#2C2C2C] rounded-lg p-2 pt-2 pb-2 text-xl hover:border-gray-300 transition-all">
      <svg
        className="w-5 h-5 text-gray-500 md:mx-2 mx-1"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35M16 10a6 6 0 1 0-12 0 6 6 0 0 0 12 0z"
        />
      </svg>
      <input
        onInput={(e) => handleSearch(e.currentTarget.value)}
        value={query}
        type="text"
        placeholder="Search..."
        className="bg-transparent focus:outline-none w-full "
      />
      {query.length !== 0 && (
        <DeleteQueryButton
          handleClick={handleDeleteQuery}
        />
      )}
    </div>
  );
}
