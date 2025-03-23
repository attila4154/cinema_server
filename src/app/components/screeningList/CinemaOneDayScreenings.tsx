import { ScreeningData } from "@/ext/csfd";
import moment from "moment";
import { H3 } from "../styled/common";
import { CinemaScreenings } from "./CinemaScreenings";

function getDateString(date: string) {
  const dateMoment = moment(date, "DD.MM.YYYY");
  if (dateMoment.isSame(moment(), "day")) {
    return "Today";
  }
  if (dateMoment.isSame(moment().add(1, "day"), "days")) {
    return "Tomorrow";
  }
  return date;
}

export function CinemaOneDayScreenings({
  data,
  cinemaName,
}: {
  data: ScreeningData;
  cinemaName: string;
}) {
  return (
    <>
      <H3 className="self-end text-2xl">
        {getDateString(data.date)}
      </H3>
      <hr />
      <ul className="flex flex-col">
        {data.screenings.map((s, idx) => (
          <li
            key={`${s.filmId}${s.screeningTimes}`}
            className="flex flex-col"
          >
            <CinemaScreenings
              data={s}
              date={data.date}
              cinemaName={cinemaName}
            />
            {idx !== data.screenings.length - 1 && (
              <hr className="w-[95%] opacity-50 self-center" />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
