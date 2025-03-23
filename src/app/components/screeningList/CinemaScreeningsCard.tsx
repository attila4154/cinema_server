import { CinemaScreeningData } from "@/ext/csfd";
import { H2 } from "../styled/common";
import { CinemaOneDayScreenings } from "./CinemaOneDayScreenings";

type Props = {
  screenings: CinemaScreeningData;
};

export function CinemaScreeningCard({ screenings }: Props) {
  return (
    <>
      <H2 className="text-3xl sticky top-0 pt-2 pb-2 z-10 bg-black">
        {screenings.cinemaName}
      </H2>
      <ul>
        {screenings.screenings
          .filter((s) => s.screenings.length !== 0)
          .map((s) => (
            <li key={s.date} className="flex flex-col">
              <CinemaOneDayScreenings
                data={s}
                cinemaName={screenings.cinemaName}
              />
            </li>
          ))}
      </ul>
    </>
  );
}
