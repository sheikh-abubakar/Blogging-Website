import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };
export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const base = variant === "primary" ? "btn-primary" : "btn-ghost";
  return <button className={`${base} ${className}`} {...props} />;
}
