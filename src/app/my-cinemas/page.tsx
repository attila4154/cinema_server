// todo: shouldn't be client component
// todo: use db and server component instead
"use client";
import { useCallback, useEffect, useState } from "react";
import {
  addCinemaToLocalStorage,
  getCinemasFromLocalStorage,
  removeCinemaFromLocalStorage,
} from "../util/local_storage";
import { AllCinemas } from "../components/AllCinemas";
import { Cinema } from "../util/http";

// todo: move to server component once I can create a user
// todo: use checkboxes
export default function MyCinemas() {
  const [myCinemas, setCinemas] = useState<Cinema[]>([]);

  useEffect(() => {
    setCinemas(getCinemasFromLocalStorage());
  }, []);

  const addCinema = useCallback(
    (cinema: Cinema) => {
      setCinemas((prev) => [...prev, cinema]);
      addCinemaToLocalStorage(cinema);
    },
    [setCinemas]
  );

  function removeCinema(cinema: Cinema) {
    setCinemas((prev) =>
      prev.filter((cin) => cin.id !== cinema.id)
    );
    removeCinemaFromLocalStorage(cinema);
  }

  return (
    <div>
      <h2 className="font-bold text-lg">My Cinemas</h2>
      {myCinemas.length && (
        <div className="flex flex-col gap-2">
          {myCinemas.map((cinema) => (
            <div key={cinema.id}>
              <div className="flex justify-between">
                <span>{cinema.name}</span>
                <span
                  className="border rounded-sm px-1 cursor-pointer"
                  onClick={() => removeCinema(cinema)}
                >
                  -
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!myCinemas.length && "No cinemas yet"}

      <AllCinemas
        myCinemas={myCinemas}
        addCinema={addCinema}
      />
    </div>
  );
}
