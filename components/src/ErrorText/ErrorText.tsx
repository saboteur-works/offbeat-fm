import TechnicalTypography from "../Typography/TechnicalTypography";

interface ErrorTextProps {
  message: string;
}

const ErrorText = ({ message }: ErrorTextProps) => {
  return <TechnicalTypography text={message} isRed />;
};

export default ErrorText;
export type { ErrorTextProps };
