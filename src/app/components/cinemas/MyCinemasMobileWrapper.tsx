"use client";

// import { useMediaQuery } from "usehooks-ts";
import { MyCinemasMobileModal } from "./MyCinemasMobileModal";

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

  // const isMobile = useMediaQuery("(max-width: 768px)");
  // if (!isMobile) {
  //   return children;
  // }
  // return (
  //   <MyCinemasMobileModal>{children}</MyCinemasMobileModal>
  // );
}
