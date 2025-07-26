import { cn } from "@/utils/cn";

const AppText = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: string;
}) => {
  return <p className={cn("text-white", style)}>{children}</p>;
};

export default AppText;
