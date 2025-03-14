"use client";

import React, { useEffect, useRef, useState } from "react";

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

  function handleOpenModal(
    e: React.MouseEvent<HTMLSelectElement>
  ) {
    e.preventDefault();
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  return (
    <>
      <select
        onChange={(e) => e.preventDefault()}
        onClick={handleOpenModal}
        className="border rounded-md w-full flex justify-between p-2"
      >
        <option>Cinemas</option>
      </select>
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
    </>
  );
}
