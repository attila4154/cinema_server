import Image from "next/image";

export default function Loading() {
  return (
    // todo: to center vertically
    <Image
      src="/loading.gif"
      alt=""
      width={50}
      height={50}
    />
  );
}
