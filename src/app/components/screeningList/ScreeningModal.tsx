import { useEffect, useMemo, useRef } from "react";
import { ScreeningProps } from "./screeningTimePills";

export function ScreeningModal({
  time,
  date,
  url,
  filmName,
  cinemaName,
  handleClose,
}: ScreeningProps & { handleClose: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const animations = useMemo(
    () => ({
      backdropOn: () => {
        modalRef.current?.classList.remove(
          "backdrop-blur-none"
        );
        modalRef.current?.classList.add("backdrop-blur-sm");
      },
      backdropOff: () => {
        modalRef.current?.classList.add(
          "backdrop-blur-none"
        );
        modalRef.current?.classList.remove(
          "backdrop-blur-sm"
        );
      },
      slideOn: () => {
        contentRef?.current?.classList.remove(
          "translate-y-[60vh]"
        );
        contentRef?.current?.classList.add("translate-y-0");
      },
      slideOff: () => {
        contentRef?.current?.classList.add(
          "translate-y-[60vh]"
        );
        contentRef?.current?.classList.remove(
          "translate-y-0"
        );
      },
    }),
    []
  );

  useEffect(() => {
    setTimeout(() => {
      animations.backdropOn();
      animations.slideOn();
    }, 30);
  }, [animations]);

  function onClose() {
    animations.backdropOff();
    animations.slideOff();
    setTimeout(() => handleClose(), 500);
  }

  return (
    // todo: portal
    <dialog
      ref={modalRef}
      open={true}
      className="z-50 w-full top-0 left-0 h-full transition-all backdrop-blur-none flex flex-col backdrop:bg-black/50 bg-black/10 justify-center items-center fixed"
      onClose={onClose}
    >
      <div
        ref={contentRef}
        className="bg-black translate-y-[60vh] text-white transition-all duration-500"
      >
        <div>
          {filmName} in {cinemaName} at {time} {date}
        </div>
        <button onClick={onClose}>close modal</button>
      </div>
    </dialog>
  );
}
