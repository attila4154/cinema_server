import { COLOR_SECONDARY } from "@/app/global";
import Image from "next/image";

export function MenuButton() {
  return (
    <div className={`p-2 rounded-full ${COLOR_SECONDARY}`}>
      <Image
        src="/menu.svg"
        width="40"
        height={"40"}
        alt=""
        className="cursor-pointer w-6 h-6"
      />
    </div>
  );
}
