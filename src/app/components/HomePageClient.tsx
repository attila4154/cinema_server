"use client";

import {
  CinemaScreeningData,
  OneDayScreening,
  ScreeningData,
} from "@/ext/csfd";
import moment from "moment";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { AuthState } from "../service/authorizationService";
import { Cinema } from "../util/http";
import {
  applyFilters,
  FilterBar,
  Filters,
} from "./FilterBar";
import MyCinemas from "./MyCinemas";
import { SearchBar } from "./SearchBar";

export const FilmDataContext = createContext<FilterData>(
  {} as FilterData
);

const weekDays = new Map([
  [1, "Mo"],
  [2, "Tu"],
  [3, "We"],
  [4, "Th"],
  [5, "Fr"],
  [6, "Sa"],
  [7, "Su"],
]);

function ScreeningTimesRow({
  screeningTimes,
}: {
  screeningTimes: string[];
}) {
  return (
    <ul className="flex gap-2">
      {screeningTimes.map((time) => (
        <li
          className="p-1 bg-slate-300 rounded-md"
          key={time}
        >
          {time}
        </li>
      ))}
    </ul>
  );
}

function formatDate(date: string) {
  const weekday = moment(date, "DD.MM.YYYY").isoWeekday();
  return `${date} (${weekDays.get(weekday)})`;
}

function FilmData({
  screening,
}: {
  screening: OneDayScreening;
}) {
  if (
    !screening.year ||
    !screening.length ||
    !screening.countries
  )
    return null;

  const country = screening.countries.join(", ");
  const data = [
    screening.year,
    country,
    `${screening.length} min`,
  ].join(", ");

  return <div>{data}</div>;
}

function FilmScreening({
  screening,
}: {
  screening: OneDayScreening;
}) {
  return (
    <div>
      <div>
        <Link
          href={`https://www.csfd.cz/film/${screening.filmId}`}
          className="text-2xl text-red-400"
          target="_blank"
        >
          {screening.filmName}
          {screening.language === "cz" && " (CZ)"}
          {screening.language === "dubbed" && " (Dub)"}
        </Link>
        <FilmData screening={screening} />
      </div>
      <ScreeningTimesRow
        screeningTimes={screening.screeningTimes}
      />
    </div>
  );
}

function DateScreenings({ data }: { data: ScreeningData }) {
  if (
    data.screenings.length === 0 ||
    data.screenings.reduce(
      (cur, s) => cur + s.screeningTimes.length,
      0
    ) === 0
  ) {
    return <></>;
  }

  const today = moment().format("DD.MM.YYYY");
  const tomorrow = moment()
    .add(1, "day")
    .format("DD.MM.YYYY");
  // todo: move to variable
  const date =
    data.date === today
      ? "Today"
      : data.date === tomorrow
      ? "Tomorrow"
      : formatDate(data.date);

  return (
    <>
      <div>
        <div className="text-xl">{date}</div>
        <hr />
        <div className="flex flex-col gap-2 mb-3">
          {data.screenings.map((screening, idx) => (
            <FilmScreening
              key={idx}
              screening={screening}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function CinemaScreeningsCard({
  data,
}: {
  data: CinemaScreeningData;
}) {
  return (
    <>
      <h2 className="text-3xl font-bold">
        {data.cinemaName}
      </h2>
      <hr />
      {data.screenings.map((screening) => (
        <DateScreenings
          key={screening.date}
          data={screening}
        />
      ))}
    </>
  );
}

function AllScreenings({
  screenings,
  onSearch,
}: {
  screenings: CinemaScreeningData[];
  onSearch: (s: string) => void;
}) {
  function hasAnyScreenings(
    cinemaScreeningData: CinemaScreeningData
  ) {
    const nScreenings = cinemaScreeningData.screenings
      .flatMap((s) =>
        s.screenings.flatMap((s) => s.screeningTimes.length)
      )
      .reduce((acc, cur) => acc + cur, 0);
    return nScreenings !== 0;
  }

  // todo: sort by the time
  return (
    <div>
      <SearchBar onSearch={onSearch} />
      <ul className="flex flex-col gap-5">
        {screenings
          .filter((s) => hasAnyScreenings(s))
          .map((cinemaScreeningData) => {
            return (
              <li key={cinemaScreeningData.cinemaId}>
                <CinemaScreeningsCard
                  data={cinemaScreeningData}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
}

function StickyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sticky top-12 overflow-auto h-[100vh]">
      {children}
    </div>
  );
}

export type FilterData = {
  minYear: number;
  maxYear: number;
};

function getFilterData(
  screenings: CinemaScreeningData[]
): FilterData {
  const years = screenings
    .flatMap((s) =>
      s.screenings.flatMap((s) =>
        s.screenings.flatMap((s) => s.year)
      )
    )
    .filter((y) => y !== undefined);

  return {
    minYear: Math.min(...years),
    maxYear: Math.max(...years),
  };
}

export function HomePageClient({
  initialScreenings,
  authState,
  initialUserCinemaIds,
  allCinemas,
}: {
  initialScreenings: CinemaScreeningData[];
  authState: AuthState;
  initialUserCinemaIds: number[];
  allCinemas: Cinema[];
}) {
  const { maxYear, minYear } = getFilterData(
    initialScreenings
  );
  const [userCinemaIds, setUserCinemaIds] = useState(
    initialUserCinemaIds
  );
  const [filters, setFilters] = useState<Filters>({
    groupBy: "cinema",
    datesSelect: "today",
    cinemas: initialUserCinemaIds,
    years: [minYear, maxYear],
  });

  const [screenings, setScreenings] = useState(() =>
    applyFilters(
      structuredClone(initialScreenings),
      filters
    )
  );

  useEffect(() => {
    console.log("ue1");
    if (userCinemaIds.length) {
      setFilters((prev) => ({
        ...prev,
        cinemas: [...userCinemaIds],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        cinemas: [],
      }));
    }
  }, [userCinemaIds, initialScreenings, setScreenings]);

  // todo: shouldn't run on the first render
  useEffect(() => {
    console.log("ue2");
    setScreenings(() =>
      applyFilters(
        structuredClone(initialScreenings),
        filters
      )
    );
  }, [
    filters,
    setScreenings,
    initialScreenings,
    userCinemaIds,
  ]);

  const onSearch = useCallback(
    (search: string) => {
      console.log("on search parent");
      setFilters((prev) => ({ ...prev, search }));
    },
    [setFilters]
  );

  return (
    <>
      <div className="grid grid-cols-[1fr_2fr_1fr] pt-12 gap-5 mb-5">
        <StickyWrapper>
          <FilmDataContext.Provider
            value={{ minYear, maxYear }}
          >
            <FilterBar
              filters={filters}
              setFilters={setFilters}
            />
          </FilmDataContext.Provider>
        </StickyWrapper>
        <AllScreenings
          screenings={screenings}
          onSearch={onSearch}
        />
        <StickyWrapper>
          <MyCinemas
            allCinemas={allCinemas}
            userCinemaIds={userCinemaIds}
            setUserCinemaIds={setUserCinemaIds}
            authState={authState}
          />
        </StickyWrapper>
      </div>
    </>
  );
}
