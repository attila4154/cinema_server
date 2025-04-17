import {
  findScreening,
  Watchlist,
} from "@/app/service/cookieWatchlistService";
import { CinemaScreeningData } from "@/ext/csfd";
import Cookies from "js-cookie";

export function applyWatchlist(
  screenings: CinemaScreeningData[],
  applyWatchlist: boolean
): CinemaScreeningData[] {
  if (!applyWatchlist) {
    return screenings;
  }
  const watchlistCookie = Cookies.get("watchlist");
  if (!watchlistCookie) {
    return screenings;
  }
  const watchlist = JSON.parse(
    watchlistCookie
  ) as Watchlist;

  return screenings.map((s1) => ({
    ...s1,
    screenings: s1.screenings.map((s2) => ({
      ...s2,
      screenings: s2.screenings.map((s3) => ({
        ...s3,
        screeningTimes: s3.screeningTimes.filter((time) =>
          findScreening(
            {
              filmName: s3.filmName,
              date: s2.date,
              cinemaName: s1.cinemaName,
              time: time,
            },
            watchlist
          )
        ),
      })),
    })),
  }));
}

export function WatchlistCheckbox({
  toggled,
  setToggled,
}: {
  toggled: boolean;
  setToggled: (arg: boolean) => void;
}) {
  function handleClick() {
    if (toggled) {
      setToggled(false);
    } else {
      setToggled(true);
    }
  }

  return (
    <div
      className="flex flex-row gap-2 items-center"
      onClick={handleClick}
    >
      <input
        id="watchlist-checkbox"
        type="checkbox"
        checked={toggled}
        className="size-4"
        onChange={(e) => e.preventDefault()}
      />
      <label htmlFor="watchlist-checkbox">
        Show watchlist only
      </label>
    </div>
  );
}
