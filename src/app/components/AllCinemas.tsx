import { useEffect, useState } from "react";
import { Cinema, fetchCinemasFrontend } from "../util/http";

export function AllCinemas({
  myCinemas,
  addCinema,
}: {
  myCinemas: Cinema[];
  addCinema: (arg: Cinema) => void;
}) {
  // todo: loading state
  const [allCinemas, setAllCinemas] = useState<Cinema[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const cinemas = await fetchCinemasFrontend();
      setAllCinemas(cinemas.filter(cin => !myCinemas.some(c => c.id === cin.id)));
    };

    fetchData();
  }, [myCinemas]);

  const cinemas = allCinemas.filter(
    (cinema) => !myCinemas.includes(cinema)
  );

  return (
    <>
      <h2 className="font-bold text-lg">All Cinemas</h2>
      <div className="flex flex-col gap-2">
        {cinemas.map((cinema) => (
          <div key={cinema.id}>
            <div className="flex justify-between">
              <span>{cinema.name}</span>
              <span
                className="border rounded-sm px-1 cursor-pointer"
                onClick={() => addCinema(cinema)}
              >
                +
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
