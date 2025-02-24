"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { AuthState } from "../service/authorizationService";
import { Cinema } from "../util/http";

type Props = {
  userCinemaIds: number[];
  setUserCinemaIds: Dispatch<SetStateAction<number[]>>;
  allCinemas: Cinema[];
  authState: AuthState;
};

// todo: use checkboxes
export default function MyCinemas({
  userCinemaIds,
  setUserCinemaIds,
  allCinemas,
  authState,
}: Props) {
  const [changed, setChanged] = useState(false);

  const userCinemas = allCinemas.filter((cin) =>
    userCinemaIds.some((id) => id === cin.cinemaId)
  );
  const otherCinemas = allCinemas.filter(
    ({ cinemaId }) => !userCinemaIds.includes(cinemaId)
  );

  function addCinema(cinema: Cinema) {
    setUserCinemaIds((prev) => [cinema.cinemaId, ...prev]);
    setChanged(true);
  }

  function removeCinema(cinema: Cinema) {
    setUserCinemaIds((prev) =>
      prev.filter((cin) => cin !== cinema.cinemaId)
    );
    setChanged(true);
  }

  // todo: error messages if failed
  // todo: move to server function
  async function saveChanges() {
    await fetch("/api/my-cinemas", {
      method: "PUT",
      body: JSON.stringify(userCinemaIds),
    });
    setChanged(false);
  }

  return (
    <div className="flex gap-2 flex-col relative">
      <h2 className="font-bold text-lg">My Cinemas</h2>
      {userCinemas.length !== 0 && (
        <div className="flex flex-col gap-2">
          {userCinemas.map((cinema) => (
            <div key={cinema.cinemaId}>
              <div className="flex gap-2">
                <button
                  className="border rounded-sm px-1 cursor-pointer"
                  onClick={() => removeCinema(cinema)}
                >
                  -
                </button>
                <span>{cinema.cinemaName}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-bold text-lg">All Cinemas</h2>
      <div className="flex flex-col gap-2">
        {otherCinemas.map((cinema) => (
          <div key={cinema.cinemaId}>
            <div className="flex gap-2">
              {addCinema && (
                <button
                  className="border rounded-sm px-1 cursor-pointer"
                  onClick={() => addCinema(cinema)}
                >
                  +
                </button>
              )}
              <span>{cinema.cinemaName}</span>
            </div>
          </div>
        ))}
      </div>

      {authState.loggedIn && (
        <div className="flex justify-end absolute t-3 -right-0 mr-4">
          <button
            className="bg-slate-200 rounded-md p-2 disabled:bg-slate-400"
            onClick={saveChanges}
            disabled={!changed}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
