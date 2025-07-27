import AppText from "@/features/components/AppText";
import { cn } from "@/utils/cn";

interface SidebarItemProps {
  title: string;
  icon?: React.ReactNode;
  textStyle?: string;
  onClick: () => void;
  isActive?: boolean;
}

const SidebarItem = ({
  title,
  icon,
  textStyle,
  onClick,
  isActive,
}: SidebarItemProps) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-start h-10 w-full gap-2 px-2 cursor-pointer select-none",
        isActive && "bg-gray-700"
      )}
      onClick={onClick}
    >
      {icon}
      <AppText style={cn("text-white line-clamp-1", textStyle)}>
        {title}
      </AppText>
    </div>
  );
};

export default SidebarItem;
