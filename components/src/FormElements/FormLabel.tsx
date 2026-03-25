interface FormLabelProps {
  id?: string;
  children?: React.ReactNode;
  htmlFor?: string;
}

export default function FormLabel({ id, children, htmlFor }: FormLabelProps) {
  return (
    <label id={id} htmlFor={htmlFor} className="text-technical uppercase">
      {children}
    </label>
  );
}
