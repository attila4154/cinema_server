// todo: shouldn't be client component
// todo: use db and server component instead + server actions
"use client";
import { useCallback, useEffect, useState } from "react";
import { AllCinemas } from "../components/AllCinemas";
import { Cinema } from "../util/http";

// todo: move to server component once I can create a user
// todo: use checkboxes
// todo: block for not logged in
export default function MyCinemas() {
  const [myCinemas, setMyCinemas] = useState<Cinema[]>([]);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    async function updateMyCinemas() {
      const res = await fetch("/api/my-cinemas");

      if (res.status >= 400) return;

      setMyCinemas(await res.json());
    }

    updateMyCinemas();
  }, []);

  const addCinema = useCallback(
    (cinema: Cinema) => {
      setMyCinemas((prev) => [...prev, cinema]);
      setChanged(true);
    },
    [setMyCinemas]
  );

  function removeCinema(cinema: Cinema) {
    setMyCinemas((prev) =>
      prev.filter((cin) => cin.id !== cinema.id)
    );
    setChanged(true);
  }

  // todo error messages if failed
  async function saveChanges() {
    await fetch("/api/my-cinemas", {
      method: "PUT",
      body: JSON.stringify(
        myCinemas.map((cinema) => cinema.id)
      ),
    });
    setChanged(false);
  }

  return (
    <div className="flex gap-2 flex-col">
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
      <div className="flex justify-end">
        <button
          className="bg-slate-200 rounded-md p-2"
          onClick={saveChanges}
          disabled={!changed}
        >
          Save
        </button>
      </div>
    </div>
  );
}
