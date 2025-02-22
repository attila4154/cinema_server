export function SearchBar() {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-2 pt-3 pb-3 mb-4 text-xl">
      <svg
        className="w-5 h-5 text-gray-500 mx-2"
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
        type="text"
        placeholder="Search..."
        className="bg-transparent focus:outline-none w-full text-gray-700"
      />
    </div>
  );
}
