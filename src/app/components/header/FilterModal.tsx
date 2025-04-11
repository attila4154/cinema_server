import { COLOR_PRIMARY } from "@/app/global";
import { useEffect, useMemo, useRef } from "react";

// todo: unify the modal
export function FilterModal({
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
      className="z-[5] w-full top-0 left-0 transition-all backdrop-blur-none duration-300 flex-col backdrop:bg-black/50 bg-black/10 items-center fixed text-[#CCCCCC] h-screen flex justify-center "
      onClose={onClose}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
    >
      <div
        ref={contentRef}
        className={`${COLOR_PRIMARY} translate-y-[100vh] transition-all duration-500 rounded-xl p-3 w-[90%] h-4/5 overflow-scroll`}
        onClick={(e) => e.preventDefault()}
      >
        {children}
      </div>
    </dialog>
  );
}
