import Image from "next/image";
import { useState } from "react";
import { ScreeningModal } from "./ScreeningModal";

export const pillClassName =
  "border rounded-2xl p-3 pt-1 pb-1 hover:border-[#00ac1c] active:border-[#00ac1c] transition-all duration-300 cursor-pointer select-none text-nowrap text-base md:text-xl";

export type ScreeningProps = {
  time: string;
  date: string;
  url?: string;
  filmName: string;
  cinemaName: string;
};

// todo: to take a look: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog#animating_dialogs
// todo: move to modal component
export function ScreeningTimePill(props: ScreeningProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleOpen() {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }

  function handleClose() {
    setIsModalOpen(false);
    document.body.style.overflow = "scroll";
  }

  return (
    <>
      <div className={pillClassName} onClick={handleOpen}>
        {props.time}
      </div>
      {isModalOpen && (
        <ScreeningModal
          handleClose={handleClose}
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
}: {
  screenings: string[];
  isOpen: boolean;
  setIsOpen: (a: boolean) => void;
}) {
  const n = screenings.length;

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  // todo: adjust height
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
      {screenings[0]} +{n - 1}
    </button>
  );
}

export function MorePills({
  screenings,
  filmName,
  date,
  cinemaName,
}: {
  screenings: string[];
  filmName: string;
  date: string;
  cinemaName: string;
}) {
  return (
    <ul className="flex flex-row gap-1 flex-wrap">
      {screenings.map((s) => (
        <ul key={s}>
          <ScreeningTimePill
            time={s}
            filmName={filmName}
            cinemaName={cinemaName}
            date={date}
          />
        </ul>
      ))}
    </ul>
  );
}
