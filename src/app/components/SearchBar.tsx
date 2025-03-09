import { debounce } from "../util/util";

export function SearchBar({
  onSearch,
}: {
  onSearch: (s: string) => void;
}) {
  const debounceSearch = debounce((query: string) => {
    onSearch(query);
  }, 150);

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-2 md:pt-3 md:pb-3 pt-2 pb-2 mb-4 text-xl border-gray-100 border-[2px] hover:border-gray-300">
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
        onInput={(e) =>
          debounceSearch(e.currentTarget.value)
        }
        type="text"
        placeholder="Search..."
        className="bg-transparent focus:outline-none w-full text-gray-700"
      />
    </div>
  );
}
