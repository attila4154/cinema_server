import {
  CinemaScreeningData,
  Language,
  OneDayScreening,
} from "@/ext/csfd";
import Fuse from "fuse.js";
import moment from "moment";
import { Dispatch, SetStateAction } from "react";

type DatesSelect =
  | "today"
  | "tomorrow"
  | "next-week"
  | "all";

export type Filters = {
  language?: Language | null;
  years?: [number, number];
  dates?: Date | [Date, Date];
  datesSelect: DatesSelect;
  country?: string;
  groupBy?: "cinema" | "film";
  cinemas?: number[];
  search?: string;
};

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
  return filtered;
}

type Props = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
};

export function FilterBar({ filters, setFilters }: Props) {
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

  function handleSelectDate(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = e.currentTarget.value;
    setFilters((prev) => ({
      ...prev,
      datesSelect: value as DatesSelect,
    }));
  }

  function handleSelectLanguage(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = e.currentTarget.value;
    setFilters((prev) => ({
      ...prev,
      language:
        value === "all" ? null : (value as Language),
    }));
  }

  return (
    <div className="ml-5 mr-5 flex flex-col gap-3">
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
          value={filters.datesSelect}
          className="border rounded-md p-1"
          onChange={handleSelectDate}
        >
          {datesOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>

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
          value={filters.language || "all"}
          className="border rounded-md p-1"
          onChange={handleSelectLanguage}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
