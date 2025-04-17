import { createContext, useContext, useState } from "react";
import { ScreeningProps } from "../components/screeningList/screeningTimePills";
import {
  findScreening,
  Watchlist,
} from "../service/cookieWatchlistService";

export type WatchlistContextValue = {
  watchlist: Watchlist;
  add: (s: ScreeningProps) => void;
  remove: (s: ScreeningProps) => void;
};

// todo:
const WatchlistContext =
  createContext<WatchlistContextValue>(
    {} as WatchlistContextValue
  );

export function WatchlistProvider({
  children,
  initialWatchlist,
}: {
  children: React.ReactNode;
  initialWatchlist: Watchlist;
}) {
  const [watchlist, setWatchlist] = useState(
    initialWatchlist
  );

  function add(s: ScreeningProps) {
    setWatchlist((prev) => [...prev, s]);
  }

  function remove(s: ScreeningProps) {
    setWatchlist((prev) => {
      const toRemove = findScreening(s, prev);
      return prev.filter((_s) => _s !== toRemove);
    });
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        add,
        remove,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () =>
  useContext(WatchlistContext);
