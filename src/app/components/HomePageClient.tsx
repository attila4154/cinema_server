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
import { applyFilters, Filters } from "./filter/FilterBar";
import { Header } from "./header/Header";
import { AllScreenings } from "./screeningList/AllScreenings";

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
    <ul className="flex gap-2 flex-wrap">
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
          className="text-2xl text-rose-400 text-wrap"
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
  cinema,
}: {
  data: CinemaScreeningData;
  cinema: Cinema | undefined;
}) {
  return (
    <>
      <h2 className="text-3xl font-bold">
        {(cinema?.url && (
          <Link
            target="_blank"
            href={cinema.url}
            className="hover:text-rose-400 transition-all duration-300"
          >
            {data.cinemaName}
          </Link>
        )) ??
          data.cinemaName}
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

function AllScreenings1({
  screenings,
  onSearch,
  cinemas,
}: {
  screenings: CinemaScreeningData[];
  onSearch: (s: string) => void;
  cinemas: Cinema[];
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
    <div className="md:m-0">
      <ul className="flex flex-col gap-5 max-w-full md:min-w-[auto] min-w-full md:min-h-auto min-h-[100vh]">
        {screenings
          .filter((s) => hasAnyScreenings(s))
          .map((cinemaScreeningData) => {
            return (
              <li key={cinemaScreeningData.cinemaId}>
                <CinemaScreeningsCard
                  data={cinemaScreeningData}
                  cinema={cinemas.find(
                    (c) =>
                      c.cinemaId ===
                      cinemaScreeningData.cinemaId
                  )}
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
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`block md:sticky md:top-12 md:overflow-auto md:h-[100vh] ${className}`}
    >
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
  const [filters, setFilters] = useState<Filters>({
    groupBy: "cinema",
    dateRange: [new Date(), new Date()],
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
    console.log("ue2");
    setScreenings(() =>
      applyFilters(
        structuredClone(initialScreenings),
        filters
      )
    );
  }, [filters, setScreenings, initialScreenings]);

  const onSearch = useCallback(
    (search: string) => {
      setFilters((prev) => ({ ...prev, search }));
    },
    [setFilters]
  );

  function onCinemaListUpdate(
    updater: (prev: number[]) => number[]
  ) {
    setFilters((prev) => {
      return { ...prev, cinemas: updater(prev.cinemas) };
    });
  }

  return (
    <>
      <main className="flex flex-col md:grid md:grid-rows-[auto_auto] md:grid-cols-[1fr_3fr_1fr]">
        <Header onSearch={onSearch} />
        <div className="bg-black/50 grid grid-cols-subgrid col-span-3 pt-5">
          <StickyWrapper className="hidden md:block">
            {/* <FilmDataContext.Provider
            value={{ minYear, maxYear }}
          >
            <FilterBar
              filters={filters}
              setFilters={setFilters}
            />
          </FilmDataContext.Provider> */}
          </StickyWrapper>
          <AllScreenings
            screenings={screenings}
            // onSearch={onSearch}
            // cinemas={allCinemas}
          />
          <div className="hidden md:block"></div>
        </div>

        {/* <div className="grid auto-rows-auto md:grid-cols-[1fr_2fr_1fr] md:pt-12 pt-2 gap-5 mb-5 md:pr-0 md:pl-0 pr-2 pl-2 min-w-[100vw] max-w-[100vw]">
        <StickyWrapper className="md:order-3 order-2">
          <MyCinemasMobileWrapper>
            <MyCinemas
              allCinemas={allCinemas}
              userCinemaIds={filters.cinemas}
              setUserCinemaIds={onCinemaListUpdate}
              authState={authState}
            />
          </MyCinemasMobileWrapper>
        </StickyWrapper>
      </div> */}
      </main>
      <div id="screening-modal" className="contents"></div>
    </>
  );
}
