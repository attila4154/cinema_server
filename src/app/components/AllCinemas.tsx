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
  const [otherCinemas, setOtherCinemas] = useState<
    Cinema[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const allCinemas = await fetchCinemasFrontend();
      setOtherCinemas(
        allCinemas.filter(
          (cin) => !myCinemas.some((c) => c.id === cin.id)
        )
      );
    };

    fetchData();
  }, [myCinemas]);

  return (
    <>
      <h2 className="font-bold text-lg">All Cinemas</h2>
      <div className="flex flex-col gap-2">
        {otherCinemas.map((cinema) => (
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
