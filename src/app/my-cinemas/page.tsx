"use client";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { AllCinemas } from "../components/AllCinemas";
import { Cinema } from "../util/http";

type Props = {
  userCinemas: Cinema[];
  setUserCinemas: Dispatch<SetStateAction<Cinema[]>>;
};

// todo: use checkboxes
export default function MyCinemas({
  userCinemas,
  setUserCinemas,
}: Props) {
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    async function init() {
      const res = await fetch("/api/my-cinemas");

      if (res.status >= 400) return;

      setUserCinemas(await res.json());
    }

    init();
  }, [setUserCinemas]);

  const addCinema = useCallback(
    (cinema: Cinema) => {
      setUserCinemas((prev) => [...prev, cinema]);
      setChanged(true);
    },
    [setUserCinemas]
  );

  function removeCinema(cinema: Cinema) {
    setUserCinemas((prev) =>
      prev.filter((cin) => cin.id !== cinema.id)
    );
    setChanged(true);
  }

  // todo error messages if failed
  async function saveChanges() {
    await fetch("/api/my-cinemas", {
      method: "PUT",
      body: JSON.stringify(
        userCinemas.map((cinema) => cinema.id)
      ),
    });
    setChanged(false);
  }

  return (
    <div className="flex gap-2 flex-col relative">
      <h2 className="font-bold text-lg">My Cinemas</h2>
      {userCinemas.length !== 0 && (
        <div className="flex flex-col gap-2">
          {userCinemas.map((cinema) => (
            <div key={cinema.id}>
              <div className="flex gap-2">
                <button
                  className="border rounded-sm px-1 cursor-pointer"
                  onClick={() => removeCinema(cinema)}
                >
                  -
                </button>
                <span>{cinema.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {userCinemas.length === 0 &&
        "You don't have any saved cinemas"}

      <AllCinemas
        myCinemas={userCinemas}
        addCinema={addCinema}
      />
      <div className="flex justify-end absolute t-3 -right-0 mr-4">
        <button
          className="bg-slate-200 rounded-md p-2 disabled:bg-slate-400"
          onClick={saveChanges}
          disabled={!changed}
        >
          Save
        </button>
      </div>
    </div>
  );
}
