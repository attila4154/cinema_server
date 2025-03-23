import { OneDayScreening } from "@/ext/csfd";
import { H4 } from "../styled/common";
import {
  MoreScreeningTimePills,
  ScreeningTimePill,
} from "./screeningTimePills";

type FilmProps = {
  filmName: string;
  year: number | undefined;
  length: string | undefined;
  countries: string[] | undefined;
};

export function Film(filmData: FilmProps) {
  if (
    !filmData.year ||
    !filmData.length ||
    !filmData.countries
  )
    return <H4 className="text-xl">{filmData.filmName}</H4>;

  const country = filmData.countries.join(", ");
  const data = [
    filmData.year,
    country,
    `${filmData.length} min`,
  ].join(", ");
  return (
    <div>
      <H4 className="text-xl">{filmData.filmName}</H4>
      <div>{data}</div>
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
  return (
    <>
      <div className="flex flex-row justify-between items-center pl-2 pr-2 pt-3 pb-3">
        <Film
          filmName={data.filmName}
          year={data.year}
          length={data.length}
          countries={data.countries}
        />
        {data.screeningTimes.length === 1 ? (
          <ScreeningTimePill
            time={data.screeningTimes[0]}
            filmName={data.filmName}
            cinemaName={cinemaName}
            date={date}
          />
        ) : (
          <MoreScreeningTimePills
            screenings={data.screeningTimes}
          />
        )}
      </div>
    </>
  );
}
