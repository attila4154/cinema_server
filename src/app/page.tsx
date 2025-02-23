import {
  CinemaScreeningData,
  parseScreenings,
  ScreeningData,
} from "@/ext/csfd";
import Link from "next/link";
import { AllCinemas } from "./components/AllCinemas";
import { SearchBar } from "./components/SearchBar";
import MyCinemas from "./my-cinemas/page";
import { getAuthState } from "./service/authorizationService";
import { getCinemasForUser } from "./service/db/cinemaService";

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

function AllScreenings({
  screenings,
}: {
  screenings: CinemaScreeningData[];
}) {
  // todo: sort by the time
  return (
    <div>
      <SearchBar />
      <ul className="flex flex-col gap-5">
        {screenings.map((cinemaScreeningData) => (
          <li key={cinemaScreeningData.cinemaId}>
            <CinemaScreeningsCard
              data={cinemaScreeningData}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function Home() {
  const allScreenings = await parseScreenings();
  const authState = await getAuthState();
  const userCinemas = authState.loggedIn
    ? await getCinemasForUser(authState.user.id)
    : [];

  let userScreenings = allScreenings.filter((s) =>
    userCinemas.some((cin) => cin.id === s.cinemaId)
  );
  if (userScreenings.length === 0) {
    userScreenings = allScreenings;
  }

  return (
    <>
      <div className="grid grid-cols-[1fr_2fr_1fr] pt-44 gap-5">
        <div></div>
        <AllScreenings screenings={userScreenings} />
        {authState.loggedIn && <MyCinemas />}
        {!authState.loggedIn && (
          <div>
            To see your list of movies{" "}
            <Link
              className="text-zinc-500 underline"
              href="/authorize/login"
            >
              login
            </Link>
            <AllCinemas myCinemas={[]} addCinema={null} />
          </div>
        )}
      </div>
    </>
  );
}
