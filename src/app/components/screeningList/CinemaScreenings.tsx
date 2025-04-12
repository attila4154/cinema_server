import { OneDayScreening } from "@/ext/csfd";
import Link from "next/link";
import { useState } from "react";
import { H4 } from "../styled/common";
import {
  MorePills,
  MoreScreeningTimePills,
  ScreeningTimePill,
} from "./screeningTimePills";

type FilmProps = {
  filmName: string;
  year: number | undefined;
  length: string | undefined;
  countries: string[] | undefined;
  id: number;
};

export function FilmInfo(filmData: FilmProps) {
  const linkHeader = (
    <Link
      href={`https://www.csfd.cz/film/${filmData.id}`}
      target="blank"
    >
      <H4>{filmData.filmName}</H4>
    </Link>
  );
  if (
    !filmData.year ||
    !filmData.length ||
    !filmData.countries
  )
    return linkHeader;

  const country = filmData.countries.join(", ");
  const data = [
    filmData.year,
    country,
    `${filmData.length} min`,
  ].join(", ");
  return (
    <div>
      {linkHeader}
      <div className="text-sm md:text-lg">{data}</div>
    </div>
  );
}

type Props = {
  data: OneDayScreening;
  cinemaName: string;
  date: string;
};

export function CinemaScreenings({
  data,
  cinemaName,
  date,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pl-2 pr-2 pt-3 pb-3 flex gap-2 flex-col">
      <div className="flex flex-row justify-between items-center gap-5">
        <FilmInfo
          filmName={data.filmName}
          year={data.year}
          length={data.length}
          countries={data.countries}
          id={data.filmId}
        />
        {data.screeningTimes.length === 1 ? (
          <ScreeningTimePill
            time={data.screeningTimes[0]}
            filmName={data.filmName}
            cinemaName={cinemaName}
            date={date}
            length={data.length}
          />
        ) : (
          <MoreScreeningTimePills
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            screenings={data.screeningTimes}
            filmName={data.filmName}
            cinemaName={cinemaName}
            date={date}
          />
        )}
      </div>

      {/* todo: animation */}
      {data.screeningTimes.length !== 1 && (
        <MorePills
          screenings={data.screeningTimes}
          filmName={data.filmName}
          cinemaName={cinemaName}
          date={date}
          isOpen={isOpen}
        />
      )}
    </div>
  );
}
