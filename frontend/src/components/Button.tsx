import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline";
};

export default function Button({
  children,
  type = "button",
  disabled = false,
  onClick,
  className = "",
  variant = "default",
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-center text-sm font-medium transition-all focus:outline-none focus:ring-4";
  
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 disabled:bg-blue-300",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:ring-gray-200 disabled:bg-gray-100"
  };
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}