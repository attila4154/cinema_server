import { CinemaScreeningData, Language } from "@/ext/csfd";
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import { Cinema } from "../util/http";

type DatesSelect = "today" | "tomorrow" | "next-week";

export type Filters = {
  language?: Language | null;
  years?: [number, number];
  dates?: Date | [Date, Date];
  datesSelect: DatesSelect;
  country?: string;
  groupBy?: "cinema" | "film";
  cinemas?: Cinema[];
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
  cinemas: Cinema[] | undefined
) {
  if (!cinemas || !cinemas.length) {
    return screenings;
  }
  return screenings.filter((data) =>
    cinemas.some((cin) => cin.id === data.cinemaId)
  );
}

export function applyFilters(
  screenings: CinemaScreeningData[],
  filters: Filters
): CinemaScreeningData[] {
  console.log("applying filters for ", filters);
  let filtered = applyDateSelect(
    screenings,
    filters.datesSelect
  );
  filtered = applyLanguageFilter(
    filtered,
    filters.language
  );

  return applyCinemasFilter(filtered, filters.cinemas);
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
    <div className="p-5">
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
        className="border rounded-md"
        onChange={handleSelectDate}
      >
        {datesOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>

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
        className="border rounded-md"
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
