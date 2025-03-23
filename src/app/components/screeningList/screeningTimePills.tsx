import { useState } from "react";
import { ScreeningModal } from "./ScreeningModal";

const pillClassName =
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
      {isModalOpen &&
        createPortal(
          <ScreeningModal
            handleClose={handleClose}
            {...props}
          />,
          document.getElementById("screening-modal")!
        )}
    </>
  );
}

export function MoreScreeningTimePills({
  screenings,
}: {
  screenings: string[];
}) {
  const n = screenings.length;
  return (
    <div className={pillClassName}>
      {screenings[0]} +{n - 1}
    </div>
  );
}
