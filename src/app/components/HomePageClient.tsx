"use client";

import {
  CinemaScreeningData,
  ScreeningData,
} from "@/ext/csfd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import MyCinemas from "../my-cinemas/page";
import { AuthState } from "../service/authorizationService";
import { Cinema } from "../util/http";
import { AllCinemas } from "./AllCinemas";
import {
  applyFilters,
  FilterBar,
  Filters,
} from "./FilterBar";
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
  return (
    <>
      <div>
        <div className="text-xl">{data.date}</div>
        <hr />
        <div className="flex flex-col gap-2">
          {data.screenings.map((screening, idx) => (
            <div key={idx}>
              <div className="text-2xl">
                {screening.filmName}
                {screening.language === "cz" && " (CZ)"}
                {screening.language === "dubbed" &&
                  " (Dub)"}
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
}: {
  screenings: CinemaScreeningData[];
}) {
  // todo: sort by the time
  return (
    <div>
      <SearchBar />
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

export function HomePageClient({
  initialScreenings,
  authState,
  userCinemas: initialUserCinemas,
}: {
  initialScreenings: CinemaScreeningData[];
  authState: AuthState;
  userCinemas: Cinema[];
}) {
  const [screenings, setScreenings] = useImmer(
    initialScreenings
  );
  const [cinemas, setCinemas] = useState(
    initialUserCinemas
  );
  const [filters, setFilters] = useState<Filters>({
    groupBy: "cinema",
    datesSelect: "today",
  });

  useEffect(() => {
    if (cinemas.length) {
      setFilters((prev) => ({
        ...prev,
        cinemas: [...cinemas],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        cinemas: [],
      }));
    }
  }, [cinemas, initialScreenings, setScreenings]);

  useEffect(() => {
    setScreenings(() =>
      applyFilters(
        structuredClone(initialScreenings),
        filters
      )
    );
  }, [filters, setScreenings, initialScreenings, cinemas]);

  return (
    <>
      <div className="grid grid-cols-[1fr_2fr_1fr] pt-44 gap-5">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
        />
        <AllScreenings screenings={screenings} />
        {authState.loggedIn && (
          <MyCinemas
            userCinemas={cinemas}
            setUserCinemas={setCinemas}
          />
        )}
        {!authState.loggedIn && (
          <div>
            To see your list of movies{" "}
            <Link
              className="text-zinc-500 underline"
              href="/authorize/login"
            >
              login
            </Link>
            <AllCinemas myCinemas={[]} addCinema={null} />
          </div>
        )}
      </div>
    </>
  );
}
