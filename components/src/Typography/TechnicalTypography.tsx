interface TechnicalTypographyProps {
  text: string;
  uppercase?: boolean;
  isRed?: boolean;
}

export default function TechnicalTypography({
  text,
  uppercase = false,
  isRed = false,
}: TechnicalTypographyProps) {
  return (
    <p
      className={`text-technical ${uppercase ? "uppercase" : ""} ${isRed ? "text-red-500" : ""}`}
    >
      {text}
    </p>
  );
}
