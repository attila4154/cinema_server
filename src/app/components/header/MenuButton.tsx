import Image from "next/image";

export function Menu() {
  return (
    <div className="m-2">
      <Image
        src="/menu.svg"
        width="40"
        height={"40"}
        alt=""
        className="cursor-pointer hover:"
      />
    </div>
  );
}
