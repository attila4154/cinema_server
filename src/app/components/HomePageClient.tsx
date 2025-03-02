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

const weekDays = new Map([
  [1, "Mo"],
  [2, "Tu"],
  [3, "We"],
  [4, "Th"],
  [5, "Fr"],
  [6, "Sa"],
  [7, "Su"],
]);

const FilmDataContext = createContext<null | CSFDMovie[]>(
  null
);

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

function FilmScreening({
  screening,
}: {
  screening: OneDayScreening;
}) {
  const filmsData = useContext(FilmDataContext);
  const filmData = filmsData?.find(
    (f) => f.id === screening.filmId
  );
  const filmName =
    filmData?.titlesOther.find(
      (t) => t.country === "US" || t.country === "USA"
    )?.title || screening.filmName;

  return (
    <div>
      <div className="text-2xl text-red-400">
        <Link
          href={`https://www.csfd.cz/film/${screening.filmId}`}
          target="_blank"
        >
          {filmName}
          {screening.language === "cz" && " (CZ)"}
          {screening.language === "dubbed" && " (Dub)"}
          {filmData?.year && ` (${filmData.year})`}
        </Link>
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
  filmData,
}: {
  initialScreenings: CinemaScreeningData[];
  authState: AuthState;
  initialUserCinemaIds: number[];
  allCinemas: Cinema[];
  filmData: CSFDMovie[];
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
      console.log("on search parent");
      setFilters((prev) => ({ ...prev, search }));
    },
    [setFilters]
  );

  return (
    <>
      <div className="grid grid-cols-[1fr_2fr_1fr] pt-12 gap-5">
        <StickyWrapper>
          <FilterBar
            filters={filters}
            setFilters={setFilters}
          />
        </StickyWrapper>
        <FilmDataContext.Provider value={filmData}>
          <AllScreenings
            screenings={screenings}
            onSearch={onSearch}
          />
        </FilmDataContext.Provider>
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
