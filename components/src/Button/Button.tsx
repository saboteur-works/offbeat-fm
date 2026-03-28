"use client";

export interface ButtonProps {
  /** The button's label */
  label: string;
  /** The function to call when the button is clicked */
  onClick?: () =>
    | void
    | ((e: React.FormEvent<HTMLFormElement>) => Promise<void>);
  /** The button's type */
  type?: "button" | "submit" | "reset" | undefined;
  /** The button's category for styling */
  category?: "primary" | "outline" | "destructive";
}

/**
 * A reusable button component that accepts a label, an onClick handler,
 * a type, and a category for styling. The category prop determines the
 * button's appearance based on predefined styles for primary, outline,
 * and destructive buttons.
 */
export const Button = ({
  label,
  onClick,
  type = "button",
  category = "primary",
}: ButtonProps) => {
  const categoryClasses = {
    primary: "bg-brand-red text-ob-primary hover:bg-[#C03838]",
    outline:
      "text-brand-mid border border-ob-border hover:border-brand-mid hover:text-white",
    destructive: "border border-ob-red-border text-ob-red",
  };

  return (
    <button
      className={`font-mono ob-btn ${categoryClasses[category]}`}
      onClick={onClick}
      type={type}
    >
      {label}
    </button>
  );
};
