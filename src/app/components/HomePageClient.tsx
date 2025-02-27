"use client";

import {
  CinemaScreeningData,
  OneDayScreening,
  ScreeningData,
} from "@/ext/csfd";
import moment from "moment";
import Link from "next/link";
import { CSFDMovie } from "node-csfd-api/interfaces/movie.interface";
import {
  createContext,
  useCallback,
  useContext,
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

const FilmDataContext = createContext<Map<
  number,
  CSFDMovie
> | null>(null);

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

function FilmScreening({
  screening,
}: {
  screening: OneDayScreening;
}) {
  const filmDataById = useContext(FilmDataContext);
  const filmName =
    filmDataById
      ?.get(screening.filmId)
      ?.titlesOther.filter(
        (t) => t.country === "US" || t.country === "USA"
      )[0]?.title ?? screening.filmName;
  return (
    <>
      <div className="text-2xl text-red-400">
        <Link
          href={`https://www.csfd.cz/film/${screening.filmId}`}
          target="_blank"
        >
          {filmName}
          {screening.language === "cz" && " (CZ)"}
          {screening.language === "dubbed" && " (Dub)"}
        </Link>
      </div>
      <ScreeningTimesRow
        screeningTimes={screening.screeningTimes}
      />
    </>
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
      : data.date;

  return (
    <>
      <div>
        <div className="text-xl">{date}</div>
        <hr />
        <div className="flex flex-col gap-2">
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
  filmDataById: Map<number, CSFDMovie>;
  onSearch: (s: string) => void;
}) {
  // todo: sort by the time
  return (
    <div>
      <SearchBar onSearch={onSearch} />
      <ul className="flex flex-col gap-5">
        {screenings.map((cinemaScreeningData) => (
          <li key={cinemaScreeningData.cinemaId}>
            <CinemaScreeningsCard
              data={cinemaScreeningData}
            />
          </li>
        ))}
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

export function HomePageClient({
  initialScreenings,
  authState,
  initialUserCinemaIds,
  allCinemas,
  filmDataById,
}: {
  initialScreenings: CinemaScreeningData[];
  authState: AuthState;
  initialUserCinemaIds: number[];
  allCinemas: Cinema[];
  filmDataById: Map<number, CSFDMovie>;
}) {
  const [userCinemaIds, setUserCinemaIds] = useState(
    initialUserCinemaIds
  );
  const [filters, setFilters] = useState<Filters>({
    groupBy: "cinema",
    datesSelect: "today",
    cinemas: initialUserCinemaIds,
  });
  // todo: make sure filters are applied on the first render (not in ue) and only once!
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
      setFilters((prev) => ({ ...prev, search }));
    },
    [setFilters]
  );

  return (
    <FilmDataContext.Provider value={filmDataById}>
      <div className="grid grid-cols-[1fr_2fr_1fr] pt-12 gap-5">
        <StickyWrapper>
          <FilterBar
            filters={filters}
            setFilters={setFilters}
          />
        </StickyWrapper>
        <AllScreenings
          screenings={screenings}
          filmDataById={filmDataById}
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
    </FilmDataContext.Provider>
  );
}
