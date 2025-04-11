import { CinemaScreeningData, Language } from "@/ext/csfd";

export function applyLanguageFilter(
  screenings: CinemaScreeningData[],
  language: Language | undefined | null
): CinemaScreeningData[] {
  if (!language) {
    return screenings;
  }
  return screenings.map((data) => {
    return {
      ...data,
      screenings: data.screenings.map((screening) => {
        return {
          ...screening,
          screenings: screening.screenings.filter(
            (s) => s.language === language
          ),
        };
      }),
    };
  });
}

export function LanguageFilter({
  language,
  selectLanguage,
}: {
  language: Language | undefined | null;
  selectLanguage: (language: Language) => void;
}) {
  const languageOptions = [
    {
      value: "all",
      text: "All",
    },
    {
      value: "subs",
      text: "Subtitles",
    },
    {
      value: "cz",
      text: "Czech",
    },
    {
      value: "dubbed",
      text: "Czech dubbing",
    },
  ];

  function handleSelectLanguage(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = e.currentTarget.value;
    selectLanguage(value as Language);
  }

  return (
    <div className="flex flex-col">
      <label htmlFor="language-select">
        <h2>Language:</h2>
      </label>
      <select
        name="language"
        id="language-select"
        value={language || "all"}
        className="rounded-md p-[6px] border border-[#3c3f43] bg-[#1a1d24]"
        onChange={handleSelectLanguage}
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
}
