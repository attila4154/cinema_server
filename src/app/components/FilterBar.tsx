// todo: break this file into several smaller ones
import {
  CinemaScreeningData,
  Language,
  OneDayScreening,
} from "@/ext/csfd";
import addDays from "date-fns/addDays";
import Fuse from "fuse.js";
import moment from "moment";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
} from "react";
import { DateRangePicker } from "rsuite";
import { RangeType } from "rsuite/esm/DateRangePicker";
import { debounce } from "../util/util";
import { FilmDataContext } from "./HomePageClient";
const { beforeToday } = DateRangePicker;

export type Filters = {
  language?: Language | null;
  years: [number, number];
  dateRange: [Date, Date];
  country?: string;
  groupBy?: "cinema" | "film";
  cinemas?: number[];
  search?: string;
};

// todo: consider changing screening list in place because it's cloned every time anyway

function applyDateSelect(
  screenings: CinemaScreeningData[],
  dateRange: [Date, Date]
): CinemaScreeningData[] {
  const [from, to] = dateRange;
  const fromMoment = moment(from);
  const toMoment = moment(to);

  return screenings.map((data) => ({
    ...data,
    screenings: data.screenings.filter((screenings) => {
      const momentScreeningDate = moment(
        screenings.date,
        "DD.MM.YYYY"
      );
      return (
        momentScreeningDate.isSameOrAfter(
          fromMoment,
          "day"
        ) &&
        momentScreeningDate.isSameOrBefore(toMoment, "day")
      );
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
    filters.dateRange
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

const predefinedRanges = [
  {
    label: "Today",
    value: [new Date(), new Date()],
  },
  {
    label: "Tomorrow",
    value: [addDays(new Date(), 1), addDays(new Date(), 1)],
  },
  {
    label: "This week",
    value: [new Date(), addDays(new Date(), 7)],
  },
  // {
  //   label: "This month",
  //   value: [startOfMonth(new Date()), new Date()],
  // },
  {
    label: "All time",
    value: [new Date(), addDays(new Date(), 365)],
  },
  {
    label: "Clear",
    value: null,
  },
] as RangeType[];

function DateFilter({
  selectDateRange,
}: {
  dateRange: [Date, Date];
  selectDateRange: (range: [Date, Date]) => void;
}) {
  return (
    <DateRangePicker
      showOneCalendar
      ranges={predefinedRanges}
      shouldDisableDate={beforeToday()}
      placeholder={"Today"}
      format="dd.MM.yyyy"
      character=" - "
      isoWeek={true}
      onOk={([from, to]) => selectDateRange([from, to])}
      onShortcutClick={(shortcut) =>
        selectDateRange(shortcut.value as [Date, Date])
      }
      onClean={() =>
        selectDateRange([new Date(), new Date()])
      }
    />
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

// todo: refactor with debounce (similar to search component)
export default function YearRangeSelector({
  range,
  setDateFilterRange,
}: {
  range: [number, number];
  setDateFilterRange: (
    range: [a: number, b: number]
  ) => void;
}) {
  // that is bad practice, but I want to update filter range only when the valid range was given
  const inputOneRef = useRef<HTMLInputElement>(null);
  const inputTwoRef = useRef<HTMLInputElement>(null);
  const { minYear, maxYear } = useContext(FilmDataContext);

  const handleInputChange = debounce(
    (index: number, value: number) => {
      if (isNaN(value)) return;
      if (index === 0) {
        const toYear = parseInt(inputTwoRef.current!.value);
        setDateFilterRange([value, toYear]);
      } else {
        const fromYear = parseInt(
          inputOneRef.current!.value
        );
        setDateFilterRange([fromYear, value]);
      }
    },
    200
  );

  const handleSliderChange = (value: number) => {
    inputTwoRef.current!.value = value.toString();
    setDateFilterRange([minYear, value]);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl self-start">Years:</h2>

      {/* Number Inputs */}
      <div className="flex space-x-4 justify-between w-full items-center mb-3">
        <input
          ref={inputOneRef}
          type="number"
          defaultValue={minYear}
          min={minYear}
          max={maxYear}
          onChange={(e) =>
            handleInputChange(
              0,
              parseInt(e.currentTarget.value)
            )
          }
          className="w-20 md:p-2 p-1 border rounded text-center"
        />
        <span className="font-bold">to</span>
        <input
          ref={inputTwoRef}
          type="number"
          defaultValue={maxYear}
          min={minYear}
          max={maxYear}
          onChange={(e) =>
            handleInputChange(
              1,
              parseInt(e.currentTarget.value)
            )
          }
          className="w-20 md:p-2 p-1 border rounded text-center"
        />
      </div>

      {/* Custom Dual Slider */}
      <div className="relative min-w-full h-6 md:m-0 mt-2/">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={range[1]}
          onChange={(e) =>
            handleSliderChange(parseInt(e.target.value))
          }
          className="absolute w-full h-2 cursor-pointer"
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
  function handleSelectDate(dateRange: [Date, Date]) {
    setFilters((prev) => ({ ...prev, dateRange }));
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
    <div className="md:ml-5 md:mr-5 ml-0 mr-0 flex flex-col gap-3">
      <DateFilter
        dateRange={filters.dateRange}
        selectDateRange={handleSelectDate}
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
