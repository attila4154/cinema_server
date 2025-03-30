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

// function StickyWrapper({
//   children,
//   className,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div
//       className={`block md:sticky md:top-12 md:overflow-auto md:h-[100vh] ${className}`}
//     >
//       {children}
//     </div>
//   );
// }

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
            // onSearch={onSearch}
            cinemas={allCinemas}
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
