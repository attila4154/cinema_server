import { useEffect, useState } from "react";
import { fetchCinemasFrontend } from "../util/http";

export function AllCinemas({
  myCinemas,
  addCinema,
}: {
  myCinemas: string[];
  addCinema: (arg: string) => void;
}) {
  // todo: loading state
  const [allCinemas, setAllCinemas] = useState<string[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const cinemas = await fetchCinemasFrontend();
      setAllCinemas(cinemas);
    };

    fetchData();
  }, []);

  const cinemas = allCinemas.filter(
    (cinema) => !myCinemas.includes(cinema)
  );

  return (
    <>
      <h2 className="font-bold text-lg">All Cinemas</h2>
      <div className="flex flex-col gap-2">
        {cinemas.map((cinema) => (
          <div key={cinema}>
            <div className="flex justify-between">
              <span>{cinema}</span>
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
