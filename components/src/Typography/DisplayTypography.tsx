interface DisplayTypographyProps {
  text: string;
}

/**
 * Product name, hero headings, section titles at large sizes
 *
 * Weights: 400, 700
 */
export default function DisplayTypography({ text }: DisplayTypographyProps) {
  return <h1 className="text-display">{text}</h1>;
}
