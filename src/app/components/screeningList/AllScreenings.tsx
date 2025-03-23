import { CinemaScreeningData } from "@/ext/csfd";
import { CinemaScreeningCard } from "./CinemaScreeningsCard";

type Props = {
  screenings: CinemaScreeningData[];
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

export function AllScreenings({ screenings }: Props) {
  return (
    <ul className="flex flex-col gap-6 md:p-0 pl-4 pr-4">
      {screenings
        .filter((s) => hasAnyScreenings(s))
        .map((s) => (
          <li key={s.cinemaId}>
            <CinemaScreeningCard screenings={s} />
          </li>
        ))}
    </ul>
  );
}
