import {
  COLOR_PRIMARY,
  COLOR_SECONDARY,
} from "@/app/global";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import moment from "moment";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { H3, H4 } from "../styled/common";
import {
  pillClassName,
  ScreeningProps,
} from "./screeningTimePills";

// todo: some
function CalendarButton({
  cinemaName,
  filmName,
  date,
  time,
  length,
}: ScreeningProps) {
  const momentDateStart = moment(
    `${date} ${time}`,
    "DD.MM.YYYY HH:mm"
  );
  const momentDateEnd = momentDateStart.add(
    length ?? 90,
    "minutes"
  );
  return (
    <div>
      <AddToCalendarButton
        name={`${cinemaName}: ${filmName}`}
        options={["Apple", "Google", "iCal"]}
        location={cinemaName}
        startDate={momentDateStart.format("YYYY-MM-DD")}
        endDate={momentDateEnd.format("YYYY-MM-DD")}
        startTime={time}
        endTime={momentDateEnd.format("HH:mm")}
        timeZone="Europe/Prague"
        buttonsList
        size="10"
        buttonStyle="round"
        hideTextLabelButton
        trigger="click"
        lightMode="dark"
      ></AddToCalendarButton>
    </div>
  );
}

const MODAL_BUTTON_CLASSNAMES = `${COLOR_SECONDARY} rounded-full p-2 border-2 min-h-12`;

function ToggleWatchlistButton(props: ScreeningModalProps) {
  const [animating, setAnimating] = useState(false);
  const handleClick = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      if (props.inWatchlist) {
        props.handleRemoveFromWatchlist();
      } else {
        props.handleAddToWatchlist();
      }
      setAnimating(false);
    }, 200);
  }, [props]);

  return (
    <button
      // todo: nice to make the button bigger on hover
      className={`${MODAL_BUTTON_CLASSNAMES} transition-all duration-200
        ${
          animating &&
          "!border-red-500 !shadow-[0_0_15px_0_#ef4444]"
        }
        ${
          props.inWatchlist &&
          "border-red-700 shadow-[0_0_5px_0_#ef4444]"
        }
        flex flex-row items-center justify-center border-[#2C2C2C]
      `}
      onClick={handleClick}
    >
      <span
        className={`transition-all duration-200 transform
         ${
           animating
             ? "opacity-0 scale-90"
             : "opacity-100 scale-100"
         }`}
      >
        {props.inWatchlist
          ? "Remove from watchlist"
          : "Want to watch"}
      </span>
      <span
        className={`absolute right-8 transition-transform duration-150 ${
          props.inWatchlist ? "scale-100" : "scale-0"
        }`}
      >
        <Image
          src="/heart.svg"
          width={20}
          height={20}
          alt=""
        />
      </span>
    </button>
  );
}

function ScreeningInfo(props: ScreeningModalProps) {
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
        <ToggleWatchlistButton {...props} />
        <button
          className={`${COLOR_SECONDARY} rounded-full p-2 text-gray-400`}
          disabled
        >
          Go to website
        </button>
        <CalendarButton {...props} />
      </div>
    </div>
  );
}

type ScreeningModalProps = ScreeningProps & {
  inWatchlist: boolean;
  handleClose: () => void;
  handleAddToWatchlist: () => void;
  handleRemoveFromWatchlist: () => void;
};

export function ScreeningModal(props: ScreeningModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const animations = useMemo(
    () => ({
      backdropOn: () => {
        modalRef.current?.classList.remove(
          "backdrop-blur-none"
        );
        modalRef.current?.classList.add("backdrop-blur-md");
      },
      backdropOff: () => {
        modalRef.current?.classList.add(
          "backdrop-blur-none"
        );
        modalRef.current?.classList.remove(
          "backdrop-blur-md"
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
    }, 0);
  }, [animations]);

  function onClose() {
    animations.backdropOff();
    animations.slideOff();
    setTimeout(() => props.handleClose(), 500);
  }

  return (
    <dialog
      ref={modalRef}
      open={true}
      className="z-50 w-full top-0 left-0 h-full transition-all backdrop-blur-none duration-500 flex flex-col backdrop:bg-black/50 bg-black/10 justify-end items-center fixed ease-in-out"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
    >
      <div
        ref={contentRef}
        className={`${COLOR_PRIMARY} translate-y-[60vh] text-white transition-all duration-500 rounded-xl p-3 w-full md:w-[50%]`}
        onClick={(e) => e.preventDefault()}
      >
        <ScreeningInfo {...props} />
      </div>
    </dialog>
  );
}
