"use client";

import { MyCinemasMobileModal } from "./MyCinemasMobileModal";

// todo: remove
export function MyCinemasMobileWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="hidden md:block">{children}</div>
      <div className="md:hidden block">
        <MyCinemasMobileModal>
          {children}
        </MyCinemasMobileModal>
      </div>
    </>
  );
}
