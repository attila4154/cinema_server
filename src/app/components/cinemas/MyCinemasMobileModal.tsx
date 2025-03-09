"use client";

import { useEffect, useRef, useState } from "react";

export function MyCinemasMobileModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  function handleOpenModal() {
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpenModal}
        className="border rounded-sm w-full"
      >
        My Cinemas
      </button>
    );
  }

  return (
    <dialog ref={modalRef} className="p-2 rounded-lg">
      <>
        <button
          onClick={handleCloseModal}
          className="absolute right-2 z-10"
        >
          close
        </button>
        {children}
      </>
    </dialog>
  );
}
