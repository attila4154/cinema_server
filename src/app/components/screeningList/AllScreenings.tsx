import { Cinema } from "@/app/util/http";
import { CinemaScreeningData } from "@/ext/csfd";
import { CinemaScreeningCard } from "./CinemaScreeningsCard";

type Props = {
  screenings: CinemaScreeningData[];
  cinemas: Cinema[];
};

function hasAnyScreenings(
  cinemaScreeningData: CinemaScreeningData
) {
  const nScreenings = cinemaScreeningData.screenings
    .flatMap((s) =>
      s.screenings.flatMap((s) => s.screeningTimes.length)
    )
    .reduce((acc, cur) => acc + cur, 0);
  return nScreenings !== 0;
}

export function AllScreenings({
  screenings,
  cinemas,
}: Props) {
  return (
    <ul className="flex flex-col gap-6 md:p-0 pl-4 pr-4">
      {screenings
        .filter((s) => hasAnyScreenings(s))
        .map((s) => (
          <li key={s.cinemaId}>
            <CinemaScreeningCard
              screenings={s}
              cinema={cinemas.find(
                (c) => c.cinemaId === s.cinemaId
              )}
            />
          </li>
        ))}
    </ul>
  );
}
