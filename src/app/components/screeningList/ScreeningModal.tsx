import { COLOR_SECONDARY } from "@/app/global";
import { useEffect, useMemo, useRef } from "react";
import { H3, H4 } from "../styled/common";
import {
  pillClassName,
  ScreeningProps,
} from "./screeningTimePills";

function ScreeningInfo(props: ScreeningProps) {
  return (
    <div className="flex flex-col gap-5 mb-5">
      <div>
        <H3>{props.cinemaName}</H3>
        <div className="flex flex-row justify-between items-center">
          <div>
            <H4>{props.date}</H4>
            <H4>{props.filmName}</H4>
          </div>
          <div className={pillClassName}>{props.time}</div>
        </div>
      </div>
      <hr />
      <div className="grid grid-rows-[1fr_1fr] text-lg gap-2">
        <button
          className={`${COLOR_SECONDARY} rounded-full p-2 inline-block`}
        >
          Want to watch
        </button>
        <button
          className={`${COLOR_SECONDARY} rounded-full p-2`}
        >
          Go to website
        </button>
      </div>
    </div>
  );
}

export function ScreeningModal({
  handleClose,
  ...props
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
          "translate-y-[30vh]"
        );
        contentRef?.current?.classList.add("translate-y-0");
      },
      slideOff: () => {
        contentRef?.current?.classList.add(
          "translate-y-[30vh]"
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
    <dialog
      ref={modalRef}
      open={true}
      className="z-50 w-full top-0 left-0 h-full transition-all backdrop-blur-none flex flex-col backdrop:bg-black/50 bg-black/10 justify-end items-center fixed"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
    >
      <div
        ref={contentRef}
        className="bg-black/90 translate-y-[30vh] text-white transition-all duration-500 rounded-xl p-3 w-full md:w-[50%]"
        onClick={(e) => e.preventDefault()}
      >
        <ScreeningInfo {...props} />
      </div>
    </dialog>
  );
}
