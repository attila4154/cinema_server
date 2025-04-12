import Cookies from "js-cookie";
import { ScreeningProps } from "../components/screeningList/screeningTimePills";

export type Watchlist = ScreeningProps[];

export function findScreening(
  screening: ScreeningProps,
  watchlist: Watchlist
) {
  return watchlist.find(
    (ws) =>
      ws.cinemaName === screening.cinemaName &&
      ws.date === screening.date &&
      ws.filmName === screening.filmName &&
      ws.time === screening.time
  );
}

// todo: consider changing names to ids
export function isInWatchlist(screening: ScreeningProps) {
  const watchlistCookie = Cookies.get("watchlist");
  if (!watchlistCookie) {
    return false;
  }
  const watchlist = JSON.parse(
    watchlistCookie
  ) as Watchlist;
  return findScreening(screening, watchlist) !== undefined;
}

export function addToWatchlist(ws: ScreeningProps) {
  const watchlistCookie = Cookies.get("watchlist") || "[]";
  const watchlist = JSON.parse(watchlistCookie);
  Cookies.set(
    "watchlist",
    JSON.stringify([...watchlist, ws])
  );
}

export function removeFromWatchlist(
  screening: ScreeningProps
) {
  const watchlistCookie = Cookies.get("watchlist") || "[]";
  const watchlist = JSON.parse(
    watchlistCookie
  ) as Watchlist;
  const savedScreening = findScreening(
    screening,
    watchlist
  );

  Cookies.set(
    "watchlist",
    JSON.stringify(
      watchlist.filter((s) => s !== savedScreening)
    )
  );
}
