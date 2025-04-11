"use client";
import { useContext } from "react";
import { Cinema } from "../util/http";
import { CinemaDataContext } from "./HomePageClient";

type Props = {
  userCinemaIds: number[];
  setUserCinemaIds: (
    updater: (prev: number[]) => number[]
  ) => void;
};

export default function MyCinemas({
  userCinemaIds,
  setUserCinemaIds,
}: Props) {
  const allCinemas = useContext(CinemaDataContext);

  const userCinemas = allCinemas.filter((cin) =>
    userCinemaIds.some((id) => id === cin.cinemaId)
  );
  const otherCinemas = allCinemas.filter(
    ({ cinemaId }) => !userCinemaIds.includes(cinemaId)
  );

  function addCinema(cinema: Cinema) {
    setUserCinemaIds((prev) => [cinema.cinemaId, ...prev]);
  }

  function removeCinema(cinema: Cinema) {
    setUserCinemaIds((prev) =>
      prev.filter((cin) => cin !== cinema.cinemaId)
    );
  }

  return (
    <div className="flex gap-2 flex-col relative">
      <h2 className="font-bold text-lg">My Cinemas</h2>
      {userCinemas.length !== 0 && (
        <div className="flex flex-col gap-2 justify-start">
          {userCinemas.map((cinema) => (
            <div
              key={cinema.cinemaId}
              className="flex gap-2 items-center"
              onClick={() => removeCinema(cinema)}
            >
              <input
                type="checkbox"
                id={`cinema-${cinema.cinemaId}`}
                checked={true}
                className="w-4 h-4"
                onChange={(e) => e.preventDefault()}
              />
              <label htmlFor={`cinema-${cinema.cinemaId}`}>
                {cinema.cinemaName}
              </label>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-bold text-lg">All Cinemas</h2>
      <div className="flex flex-col gap-2">
        {otherCinemas.map((cinema) => (
          <div
            key={cinema.cinemaId}
            className="flex gap-2 items-center"
            onClick={() => addCinema(cinema)}
          >
            <input
              type="checkbox"
              id={`cinema-${cinema.cinemaId}`}
              checked={false}
              onChange={(e) => e.preventDefault()}
              className="w-4 h-4"
              // className="cursor-pointer peer hidden"
            />
            {/* <span className="w-5 h-5 border-2 rounded-sm border-gray-400 peer-hover:border-blue-500"></span> */}

            <label
              htmlFor={`cinema-${cinema.cinemaId}`}
              className="cursor-pointer"
            >
              {cinema.cinemaName}
            </label>
          </div>
        ))}
      </div>

      {/* {authState.loggedIn && (
        <div className="justify-end absolute t-3 -right-0 mr-4 md:flex hidden">
          <button
            className="bg-slate-200 rounded-md p-2 disabled:bg-slate-400"
            onClick={saveChanges}
            disabled={!changed}
          >
            Save
          </button>
        </div>
      )} */}
    </div>
  );
}
