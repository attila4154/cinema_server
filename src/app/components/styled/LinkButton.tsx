import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

export type LinkButtonProps = LinkProps & {
  children: ReactNode;
};

export function LinkButton({
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className="bg-slate-200 rounded-md p-2 flex-1"
      {...props}
    >
      {children}
    </Link>
  );
}
