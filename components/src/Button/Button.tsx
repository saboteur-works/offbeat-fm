"use client";
export interface ButtonProps {
  label: string;
  onClick?: () =>
    | void
    | ((e: React.FormEvent<HTMLFormElement>) => Promise<void>);
  type?: "button" | "submit" | "reset" | undefined;
  category?: "primary" | "outline" | "destructive";
}

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
