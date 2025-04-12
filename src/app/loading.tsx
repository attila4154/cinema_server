import Image from "next/image";

// todo: skeleton layout?
export default function Loading() {
  return (
    <main className="flex items-center justify-center h-[100vh]">
      <Image
        src="/loading.gif"
        alt=""
        width={50}
        height={50}
        unoptimized
      />
    </main>
  );
}
