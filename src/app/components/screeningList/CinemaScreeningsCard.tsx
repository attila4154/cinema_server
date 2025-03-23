import { Cinema } from "@/app/util/http";
import { CinemaScreeningData } from "@/ext/csfd";
import Link from "next/link";
import { H2 } from "../styled/common";
import { CinemaOneDayScreenings } from "./CinemaOneDayScreenings";

type Props = {
  screenings: CinemaScreeningData;
  cinema: Cinema | undefined;
};

export function CinemaScreeningCard({
  screenings,
  cinema,
}: Props) {
  return (
    <>
      <H2 className="sticky top-0 pt-2 pb-2 z-10 bg-black">
        {cinema?.url && (
          <Link
            target="_blank"
            href={cinema.url}
            className={`hover:text-[#40bcf4] transition-all`}
          >
            {screenings.cinemaName}
          </Link>
        )}
        {!cinema?.url && <>{screenings.cinemaName}</>}
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
