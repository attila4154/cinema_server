import Image from "next/image";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
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
