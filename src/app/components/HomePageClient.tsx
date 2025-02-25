"use client";

import {
  CinemaScreeningData,
  ScreeningData,
} from "@/ext/csfd";
import moment from "moment";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AuthState } from "../service/authorizationService";
import { Cinema } from "../util/http";
import {
  applyFilters,
  FilterBar,
  Filters,
} from "./FilterBar";
import MyCinemas from "./MyCinemas";
import { SearchBar } from "./SearchBar";

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

function DateScreenings({ data }: { data: ScreeningData }) {
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
            <div key={idx}>
              <div className="text-2xl text-red-400">
                <Link
                  href={`https://www.csfd.cz/film/${screening.filmId}`}
                  target="_blank"
                >
                  {screening.filmName}
                  {screening.language === "cz" && " (CZ)"}
                  {screening.language === "dubbed" &&
                    " (Dub)"}
                </Link>
              </div>
              <ScreeningTimesRow
                screeningTimes={screening.screeningTimes}
              />
            </div>
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
}: {
  initialScreenings: CinemaScreeningData[];
  authState: AuthState;
  initialUserCinemaIds: number[];
  allCinemas: Cinema[];
}) {
  const [userCinemaIds, setUserCinemaIds] = useState(
    initialUserCinemaIds
  );
  const [filters, setFilters] = useState<Filters>({
    groupBy: "cinema",
    datesSelect: "today",
    cinemas: initialUserCinemaIds,
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
      <div className="grid grid-cols-[1fr_2fr_1fr] pt-12 gap-5">
        <StickyWrapper>
          <FilterBar
            filters={filters}
            setFilters={setFilters}
          />
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
