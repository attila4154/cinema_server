import { COLOR_SECONDARY } from "@/app/global";
import Image from "next/image";
import { useState } from "react";
import { FilterModal } from "./FilterModal";

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
