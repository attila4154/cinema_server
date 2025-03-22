// import { CinemaScreeningData, Language } from "@/ext/csfd";

// export function LanguageFilter({
//   language,
//   selectLanguage,
// }: {
//   language: Language | undefined | null;
//   selectLanguage: (language: Language) => void;
// }) {
//   const languageOptions = [
//     {
//       value: "all",
//       text: "All",
//     },
//     {
//       value: "subs",
//       text: "Subtitles",
//     },
//     {
//       value: "cz",
//       text: "Czech",
//     },
//     {
//       value: "dubbed",
//       text: "Czech dubbing",
//     },
//   ];

//   function handleSelectLanguage(
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) {
//     const value = e.currentTarget.value;
//     selectLanguage(value as Language);
//   }

//   return (
//     <div className="flex flex-col">
//       <label
//         htmlFor="language-select"
//         className="text-2xl block"
//       >
//         Language:
//       </label>
//       <select
//         name="language"
//         id="language-select"
//         value={language || "all"}
//         className="border rounded-md p-[6px]"
//         onChange={handleSelectLanguage}
//       >
//         {languageOptions.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.text}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }
