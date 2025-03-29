import {
  COLOR_PRIMARY,
  COLOR_SECONDARY,
} from "@/app/global";
import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

function FilterModal({
  handleClose,
  children,
}: {
  handleClose: () => void;
  children: React.ReactNode;
}) {
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
          "translate-y-[100vh]"
        );
        contentRef?.current?.classList.add("translate-y-0");
      },
      slideOff: () => {
        contentRef?.current?.classList.add(
          "translate-y-[100vh]"
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
      className="z-[5] w-full top-0 left-0 h-full transition-all backdrop-blur-none duration-300 flex flex-col backdrop:bg-black/50 bg-black/10 justify-end items-center fixed"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
    >
      <div
        ref={contentRef}
        className={`${COLOR_PRIMARY} translate-y-[100vh] text-white transition-all duration-500 rounded-xl p-3 w-[90%] h-full m-28`}
        onClick={(e) => e.preventDefault()}
      >
        {children}
      </div>
    </dialog>
  );
}

export function FilterButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function open() {
    setIsModalOpen(true);
  }
  function close() {
    setIsModalOpen(false);
  }

  return (
    <>
      <button
        onClick={open}
        className={`p-2 rounded-full inline-block ${COLOR_SECONDARY}`}
      >
        <Image
          src="/icon_filter.svg"
          width="40"
          height={"40"}
          alt=""
          className="cursor-pointer w-6 h-6 md:h-7 md:w-7 object-cover"
        />
      </button>
      {isModalOpen && (
        <FilterModal handleClose={close}>
          {children}
        </FilterModal>
      )}
    </>
  );
}
