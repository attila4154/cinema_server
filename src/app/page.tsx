import {
  CinemaScreeningData,
  parseScreenings,
  ScreeningData,
} from "@/ext/csfd";
import { SearchBar } from "./components/SearchBar";
import MyCinemas from "./my-cinemas/page";

function ScreeningTimesRow({
  screeningTimes,
}: {
  screeningTimes: string[];
}) {
  return (
    <ul className="flex gap-2">
      {screeningTimes.map((time) => (
        <li
          className="p-1 bg-slate-300 rounded-md"
          key={time}
        >
          {time}
        </li>
      ))}
    </ul>
  );
}

function DateScreenings({ data }: { data: ScreeningData }) {
  return (
    <>
      <div>
        <div className="text-xl">{data.date}</div>
        <hr />
        <div className="flex flex-col gap-2">
          {data.screenings.map((screening, idx) => (
            <div key={idx}>
              <div className="text-2xl">
                {screening.filmName}
                {screening.language === "cz" && " (CZ)"}
                {screening.language === "dubbed" &&
                  " (Dub)"}
              </div>
              <ScreeningTimesRow
                screeningTimes={screening.screeningTimes}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function CinemaScreeningsCard({
  data,
}: {
  data: CinemaScreeningData;
}) {
  return (
    <>
      <h2 className="text-3xl font-bold">
        {data.cinemaName}
      </h2>
      <hr />
      {data.screenings.map((screening) => (
        <DateScreenings
          key={screening.date}
          data={screening}
        />
      ))}
    </>
  );
}

export default async function Home() {
  const screeningsData = await parseScreenings();

  return (
    <>
      <div className="grid grid-cols-3 pt-56 gap-5">
        <div></div>
        <div>
          <SearchBar />
          <ul className="flex flex-col gap-5">
            {screeningsData.map((cinemaScreeningData) => (
              <li key={cinemaScreeningData.cinemaId}>
                <CinemaScreeningsCard
                  data={cinemaScreeningData}
                />
              </li>
            ))}
          </ul>
        </div>
        <MyCinemas />
      </div>
    </>
  );
}
