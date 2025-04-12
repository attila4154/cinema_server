import {
  addToWatchlist,
  findScreening,
  removeFromWatchlist,
} from "@/app/service/cookieWatchlistService";
import Image from "next/image";
import { useCallback, useContext, useState } from "react";
import { WatchlistContext } from "../HomePageClient";
import { ScreeningModal } from "./ScreeningModal";

export const pillClassName =
  "border rounded-2xl p-3 pt-1 pb-1  transition-all cursor-pointer select-none text-nowrap text-base md:text-xl";

export type ScreeningProps = {
  time: string;
  date: string;
  url?: string;
  filmName: string;
  cinemaName: string;
  length?: string;
};

// todo: to take a look: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog#animating_dialogs
// todo: move to modal component
export function ScreeningTimePill(props: ScreeningProps) {
  const initialWatchlist = useContext(WatchlistContext);
  const [inWatchlist, setInWatchlist] = useState(
    () =>
      findScreening(props, initialWatchlist) !== undefined
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleOpen() {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }

  function handleClose() {
    setIsModalOpen(false);
    document.body.style.overflow = "scroll";
  }

  const handleAddToWatchlist = useCallback(() => {
    setInWatchlist(true);
    addToWatchlist(props);
  }, [props]);

  const handleRemoveFromWatchlist = useCallback(() => {
    setInWatchlist(false);
    removeFromWatchlist(props);
  }, [props]);

  return (
    <>
      <div
        className={`${pillClassName} ${
          inWatchlist &&
          "border-red-500 shadow-[0_0px_5px_0_#ef4444] flex flex-row justify-center items-center gap-2 "
        }`}
        onClick={handleOpen}
      >
        <span>{props.time}</span>
        {inWatchlist && (
          <Image
            src="/heart.svg"
            width={16}
            height={16}
            alt=""
          />
        )}
      </div>
      {isModalOpen && (
        <ScreeningModal
          handleClose={handleClose}
          inWatchlist={inWatchlist}
          handleAddToWatchlist={handleAddToWatchlist}
          handleRemoveFromWatchlist={
            handleRemoveFromWatchlist
          }
          {...props}
        />
      )}
    </>
  );
}

export function MoreScreeningTimePills({
  screenings,
  isOpen,
  setIsOpen,
  filmName,
  cinemaName,
  date,
}: {
  screenings: string[];
  isOpen: boolean;
  setIsOpen: (a: boolean) => void;
  filmName: string;
  cinemaName: string;
  date: string;
}) {
  // todo: for now this adding some screening inside this list won't update hasInWatchlist, only on reload
  // but for now it's def not a prio
  const initialWatchlist = useContext(WatchlistContext);
  const hasInWatchlist = screenings.some(
    (s) =>
      findScreening(
        {
          cinemaName,
          filmName,
          date,
          time: s,
        },
        initialWatchlist
      ) !== undefined
  );
  const n = screenings.length;

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  // todo: adjust height
  // todo: animate width change
  return isOpen ? (
    <button className={pillClassName} onClick={close}>
      <Image
        className="h-6 w-6"
        height={100}
        width={100}
        alt=""
        src="/icon_hide.svg"
      />
    </button>
  ) : (
    <button className={pillClassName} onClick={open}>
      <span>{screenings[0]}&nbsp;</span>
      <span
        className={`${hasInWatchlist && "text-red-500"}`}
      >
        +{n - 1}
      </span>
    </button>
  );
}

export function MorePills({
  screenings,
  filmName,
  date,
  cinemaName,
  isOpen,
}: {
  screenings: string[];
  filmName: string;
  date: string;
  cinemaName: string;
  isOpen: boolean;
}) {
  return (
    <ul
      // todo: animation
      className={`flex flex-row gap-2 flex-wrap transition-all overflow-hidden ${
        isOpen ? "h-auto " : "h-0"
      }`}
    >
      {screenings.map((s) => (
        <li key={filmName + s}>
          <ScreeningTimePill
            time={s}
            filmName={filmName}
            cinemaName={cinemaName}
            date={date}
          />
        </li>
      ))}
    </ul>
  );
}
