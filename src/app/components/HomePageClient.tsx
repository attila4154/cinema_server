"use client";

import { CinemaScreeningData } from "@/ext/csfd";
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
} from "./filter/FilterBar";
import { Header } from "./header/Header";
import { AllScreenings } from "./screeningList/AllScreenings";

export const FilmDataContext = createContext<FilterData>(
  {} as FilterData
);

export const CinemaDataContext = createContext<Cinema[]>(
  []
);

export const AuthStateContext = createContext<AuthState>(
  {} as AuthState
);

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

  return (
    <AuthStateContext.Provider value={authState}>
      <main className="flex flex-col md:grid md:grid-rows-[auto_auto] md:grid-cols-[1fr_3fr_1fr]">
        <Header onSearch={onSearch}>
          <CinemaDataContext.Provider value={allCinemas}>
            <FilmDataContext.Provider
              value={{ minYear, maxYear }}
            >
              <FilterBar
                filters={filters}
                setFilters={setFilters}
              />
            </FilmDataContext.Provider>
          </CinemaDataContext.Provider>
        </Header>
        <div className="bg-black/90 grid grid-cols-subgrid col-span-3 pt-5">
          <div></div>
          <AllScreenings
            screenings={screenings}
            // todo: it's dumb that I pass it as a param and not use from context
            cinemas={allCinemas}
          />
          <div className="hidden md:block"></div>
        </div>
      </main>
      <div id="screening-modal" className="contents"></div>
    </AuthStateContext.Provider>
  );
}
