interface BodyTypographyProps {
  text: string;
  weight?: "normal" | "bold";
}

/**
 * UI text, descriptions, nav labels
 *
 * Weights: 400, 700
 */
export default function BodyTypography({
  text,
  weight = "normal",
}: BodyTypographyProps) {
  return (
    <p
      className={`text-body ${weight === "bold" ? "font-bold" : "font-normal"}`}
    >
      {text}
    </p>
  );
}
