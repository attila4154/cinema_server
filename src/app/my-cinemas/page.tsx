"use client";
import { useCallback, useEffect, useState } from "react";
import {
  addCinemaToLocalStorage,
  getCinemasFromLocalStorage,
  removeCinemaFromLocalStorage,
} from "../util/local_storage";
import { AllCinemas } from "../components/AllCinemas";

// todo: move to server component once I can create a user
// todo: use checkboxes 
export default function MyCinemas() {
  const [myCinemas, setCinemas] = useState<string[]>([]);

  useEffect(() => {
    setCinemas(getCinemasFromLocalStorage());
  }, []);

  const addCinema = useCallback(
    (cinema: string) => {
      setCinemas((prev) => [...prev, cinema]);
      addCinemaToLocalStorage(cinema);
    },
    [setCinemas]
  );

  function removeCinema(cinema: string) {
    setCinemas((prev) =>
      prev.filter((cin) => cin !== cinema)
    );
    removeCinemaFromLocalStorage(cinema);
  }

  return (
    <div>
      <h2 className="font-bold text-lg">My Cinemas</h2>
      {myCinemas.length && (
        <div className="flex flex-col gap-2">
          {myCinemas.map((cinema) => (
            <div key={cinema}>
              <div className="flex justify-between">
                <span>{cinema}</span>
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
