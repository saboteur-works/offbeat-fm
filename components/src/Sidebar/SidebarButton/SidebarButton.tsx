export interface SidebarButtonProps {
  label: string;
  textAlign?: "left" | "center" | "right";
  onClick?: () => void;
}

const SidebarButton = ({
  label,
  onClick,
  textAlign = "center",
}: SidebarButtonProps) => {
  return (
    <button
      className={`hover:border-l-bar hover:border-ob-red-border p-2 w-full text-ob-body text-${textAlign}`}
      onClick={() => onClick && onClick()}
    >
      {label}
    </button>
  );
};

export default SidebarButton;
