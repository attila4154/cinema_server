export function H2({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className={`${className} md:text-4xl`}>
      {children}
    </h2>
  );
}

export function H3({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={`${className} md:text-3xl`}>
      {children}
    </h3>
  );
}

export function H4({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <h4 className={`${className} md:text-2xl`}>
      {children}
    </h4>
  );
}
