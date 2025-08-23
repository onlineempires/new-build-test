"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

type Props = LinkProps & {
  className?: string;
  children: ReactNode;
  as?: "span" | "div" | "a";
};

export default function SafeLink({ href, className, children, as = "span", ...rest }: Props) {
  const Comp = as as any;
  // Wrap whatever you pass in a single element so Next never sees multiple children
  return (
    <Link href={href} {...rest}>
      <Comp className={className}>{children}</Comp>
    </Link>
  );
}