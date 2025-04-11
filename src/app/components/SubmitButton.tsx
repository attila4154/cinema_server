import Image from "next/image";
import { useFormStatus } from "react-dom";
import { COLOR_SECONDARY } from "../global";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center ${COLOR_SECONDARY} mt-6`}
      disabled={pending}
    >
      {pending ? (
        <Image
          src="/loading.gif"
          alt=""
          width={28}
          height={28}
        />
      ) : (
        "Submit"
      )}
    </button>
  );
}
