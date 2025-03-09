import {
  CinemaScreeningData,
  Language,
  OneDayScreening,
} from "@/ext/csfd";
import Fuse from "fuse.js";
import moment from "moment";
import {
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { FilmDataContext } from "./HomePageClient";

type DatesSelect =
  | "today"
  | "tomorrow"
  | "next-week"
  | "all";

export type Filters = {
  language?: Language | null;
  years: [number, number];
  // dates?: Date | [Date, Date]; // not used yet
  datesSelect: DatesSelect;
  country?: string;
  groupBy?: "cinema" | "film";
  cinemas?: number[];
  search?: string;
};

// todo: consider changing screening list in place because it's cloned every time anyway

function applyDateSelect(
  screenings: CinemaScreeningData[],
  dataSelect: DatesSelect
): CinemaScreeningData[] {
  return screenings.map((data) => ({
    ...data,
    screenings: data.screenings.filter((screenings) => {
      if (dataSelect === "today") {
        // todo: tests?
        return (
          moment().format("DD.MM.YYYY") === screenings.date
        );
      }
      if (dataSelect === "tomorrow") {
        return (
          moment().add(1, "days").format("DD.MM.YYYY") ===
          screenings.date
        );
      }
      if (dataSelect === "next-week") {
        const momentScreeningDate = moment(
          screenings.date,
          "DD.MM.YYYY"
        );
        return moment()
          .add(7, "days")
          .isAfter(momentScreeningDate);
      }
      if (dataSelect === "all") {
        return true;
      }
      return false;
    }),
  }));
}

function applyLanguageFilter(
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

function applyCinemasFilter(
  screenings: CinemaScreeningData[],
  cinemas: number[] | undefined
) {
  if (!cinemas || !cinemas.length) {
    return screenings;
  }
  return screenings.filter((data) =>
    cinemas.some((cin) => cin === data.cinemaId)
  );
}

function applySearchFilter(
  screenings: CinemaScreeningData[],
  search: string | undefined
) {
  if (!search) {
    return screenings;
  }
  function filterScreeningsByFilmName(
    screenings: OneDayScreening[],
    search: string
  ) {
    const res = new Fuse(screenings, {
      keys: ["filmName"],
      shouldSort: false,
      threshold: 0.3,
      ignoreDiacritics: true,
    })
      .search(search)
      .map((d) => d.item as OneDayScreening);
    return res;
  }
  return screenings.map((s) => ({
    ...s,
    screenings: s.screenings.map((s) => ({
      ...s,
      screenings: filterScreeningsByFilmName(
        s.screenings,
        search
      ),
    })),
  }));
}

export function applyYearRangeFilter(
  screenings: CinemaScreeningData[],
  years: [number, number] | undefined
): CinemaScreeningData[] {
  if (!years) return screenings;
  return screenings.map((s) => ({
    ...s,
    screenings: s.screenings.map((s) => ({
      ...s,
      screenings: s.screenings.filter(
        (s) =>
          s.year && s.year >= years[0] && s.year <= years[1]
      ),
    })),
  }));
}

export function applyFilters(
  screenings: CinemaScreeningData[],
  filters: Filters
): CinemaScreeningData[] {
  let filtered = applyDateSelect(
    screenings,
    filters.datesSelect
  );
  filtered = applyLanguageFilter(
    filtered,
    filters.language
  );

  filtered = applyCinemasFilter(filtered, filters.cinemas);
  filtered = applySearchFilter(filtered, filters.search);
  filtered = applyYearRangeFilter(filtered, filters.years);
  return filtered;
}

type Props = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
};

function DateFilter({
  date,
  selectDate,
}: {
  date: DatesSelect;
  selectDate: (date: DatesSelect) => void;
}) {
  const datesOptions = [
    {
      value: "today",
      text: "Today",
    },
    {
      value: "tomorrow",
      text: "Tomorrow",
    },
    {
      value: "next-week",
      text: "Next week",
    },
    {
      value: "all",
      text: "All",
    },
  ];

  function handleSelectDate(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = e.currentTarget.value;
    selectDate(value as DatesSelect);
  }

  return (
    <div className="flex flex-col">
      <label
        htmlFor="dates-select"
        className="text-2xl block"
      >
        Dates:
      </label>
      <select
        name="dates"
        id="dates-select"
        value={date}
        className="border rounded-md p-[6px]"
        onChange={handleSelectDate}
      >
        {datesOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
}

function LanguageFilter({
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
      <label
        htmlFor="language-select"
        className="text-2xl block"
      >
        Language:
      </label>
      <select
        name="language"
        id="language-select"
        value={language || "all"}
        className="border rounded-md p-[6px]"
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

export default function YearRangeSelector({
  range,
  setDateFilterRange,
}: {
  range: [number, number];
  setDateFilterRange: (
    range: [a: number, b: number]
  ) => void;
}) {
  // todo: handle nulls
  const { minYear, maxYear } = useContext(FilmDataContext);

  // todo: handle ...
  // useEffect(() => {
  //   range[0] = Math.max(range[0], minYear);
  //   range[1] = Math.max(range[1], maxYear);
  // }, [minYear, maxYear, range]);

  const handleSliderChange = (
    index: number,
    value: number
  ) => {
    const newRange = [...range] as [number, number];
    newRange[index] = value;

    // Ensure the "from" year is never greater than the "to" year
    if (newRange[0] > newRange[1]) {
      newRange[index === 0 ? 1 : 0] = value;
    }

    setDateFilterRange(newRange);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) return;

    // Ensure value stays within bounds
    newValue = Math.max(
      minYear,
      Math.min(newValue, maxYear)
    );

    const newRange = [...range] as [number, number];
    newRange[index] = newValue;

    // Ensure valid range order
    if (newRange[0] > newRange[1]) {
      newRange[index === 0 ? 1 : 0] = newValue;
    }
    setDateFilterRange(newRange);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl self-start">Years:</h2>

      {/* Number Inputs */}
      <div className="flex space-x-4 justify-between w-full items-center">
        <input
          type="number"
          value={range[0]}
          min={minYear}
          max={maxYear}
          onChange={(e) => handleInputChange(e, 0)}
          className="w-20 p-2 border rounded text-center"
        />
        <span className="font-bold">to</span>
        <input
          type="number"
          value={range[1]}
          min={minYear}
          max={maxYear}
          onChange={(e) => handleInputChange(e, 1)}
          className="w-20 p-2 border rounded text-center"
        />
      </div>

      {/* Custom Dual Slider */}
      <div className="relative w-full max-w-md h-6">
        {/* Track */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-300 rounded transform -translate-y-1/2"></div>

        {/* Selected Range (Filled Part of Track) */}
        <div
          className="absolute top-1/2 h-2 bg-blue-500 rounded transform -translate-y-1/2"
          style={{
            left: `${
              ((range[0] - minYear) / (maxYear - minYear)) *
              100
            }%`,
            right: `${
              100 -
              ((range[1] - minYear) / (maxYear - minYear)) *
                100
            }%`,
          }}
        ></div>

        {/* Left Handle */}
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={range[0]}
          onChange={(e) =>
            handleSliderChange(0, parseInt(e.target.value))
          }
          className="absolute w-full h-2 opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
          title={range[0].toString()}
        />
        {/* Right Handle */}
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={range[1]}
          onChange={(e) =>
            handleSliderChange(1, parseInt(e.target.value))
          }
          className="absolute w-full h-2 opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
          title={range[1].toString()}
        />
      </div>
      <div className="flex flex-row justify-between w-full">
        <span>{minYear}</span>
        <span>{maxYear}</span>
      </div>
    </div>
  );
}

export function FilterBar({ filters, setFilters }: Props) {
  function handleSelectDate(date: DatesSelect) {
    setFilters((prev) => ({ ...prev, datesSelect: date }));
  }

  function handleSelectLanguage(language: Language) {
    setFilters((prev) => ({ ...prev, language: language }));
  }

  function handleSelectYearRange(
    years: [a: number, b: number]
  ) {
    setFilters((prev) => ({ ...prev, years }));
  }

  return (
    <div className="ml-5 mr-5 flex flex-col gap-3">
      <DateFilter
        date={filters.datesSelect}
        selectDate={handleSelectDate}
      />
      <LanguageFilter
        language={filters.language}
        selectLanguage={handleSelectLanguage}
      />
      <YearRangeSelector
        range={filters.years}
        setDateFilterRange={handleSelectYearRange}
      />
    </div>
  );
}
