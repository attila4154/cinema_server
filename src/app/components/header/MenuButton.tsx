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
import { createPortal } from "react-dom";

// todo: move into one modal component
export function MenuButton() {
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
        className={`p-2 rounded-full ${COLOR_SECONDARY}`}
        onClick={open}
      >
        <Image
          src="/menu.svg"
          width="40"
          height={"40"}
          alt=""
          className="cursor-pointer w-6 h-6"
        />
      </button>
      {isModalOpen &&
        createPortal(
          <MenuModal handleClose={close} />,
          document.getElementById("screening-modal")!
        )}
    </>
  );
}

function MenuModal({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const animations = useMemo(
    () => ({
      backdropOn: () => {
        modalRef.current?.classList.replace(
          "backdrop-blur-none",
          "backdrop-blur-sm"
        );
      },
      backdropOff: () => {
        modalRef.current?.classList.replace(
          "backdrop-blur-sm",
          "backdrop-blur-none"
        );
      },
      slideOn: () => {
        contentRef?.current?.classList.replace(
          "-translate-x-[20vw]",
          "translate-x-0"
        );
      },
      slideOff: () => {
        contentRef?.current?.classList.replace(
          "translate-x-0",
          "-translate-x-[20vw]"
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
      className="z-[5] w-full top-0 left-0 h-full transition-all backdrop-blur-none duration-300 flex flex-col backdrop:bg-black/50 bg-black/10 justify-end items-center fixed text-[#CCCCCC]"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
    >
      <div
        ref={contentRef}
        className={`${COLOR_PRIMARY} -translate-x-[20vw] transition-all duration-500 rounded-xl p-5 h-full overflow-scroll self-start`}
        onClick={(e) => e.preventDefault()}
      >
        {/* {!authState.loggedIn && (
          <Link href="/authorize/login">Login</Link>
        )}
        {authState.loggedIn && <LogoutButton />} */}
      </div>
    </dialog>
  );
}
