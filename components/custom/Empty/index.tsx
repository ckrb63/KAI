import { cn } from "@/lib/utils";
import { BirdIcon } from "lucide-react";
import Image from "next/image";

interface Props {
  label: string;
  color: string;
}

const Empty = ({ label, color }: Props) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <BirdIcon size={100} className={cn(color)} />
      <p className="text-muted-foreground text-sm text-center">{label}</p>
    </div>
  );
};

export default Empty;
