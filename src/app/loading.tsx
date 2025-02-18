import Image from "next/image";

export default function Loading() {
  return (
    // todo: to center vertically
    <Image
      src="/Loading_icon.gif"
      alt=""
      width={100}
      height={100}
    />
  );
}
