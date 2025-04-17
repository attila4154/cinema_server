import {
  CinemaScreeningData,
  Language,
  OneDayScreening,
} from "@/ext/csfd";
import Fuse from "fuse.js";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import MyCinemas from "../MyCinemas";
import { applyDateSelect, DateFilter } from "./DateFilter";
import {
  applyLanguageFilter,
  LanguageFilter,
} from "./LanguageFilter";
import {
  applyYearRangeFilter,
  YearRangeSelector,
} from "./YearFilter";

export type Filters = {
  language?: Language | null;
  years: [number, number];
  dateRange: [Date, Date];
  country?: string;
  groupBy?: "cinema" | "film";
  cinemas: number[];
  search?: string;
};

// todo: consider changing screening list in place because it's cloned every time anyway
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

  function handleCinemaListUpdate(
    updater: (ids: number[]) => number[]
  ) {
    setFilters((prev) => {
      const newCinemaIds = updater(prev.cinemas);
      Cookies.set("cinemaIds", newCinemaIds.join(","));
      return { ...prev, cinemas: newCinemaIds };
    });
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
      <MyCinemas
        userCinemaIds={filters.cinemas}
        setUserCinemaIds={handleCinemaListUpdate}
      />
    </div>
  );
}
