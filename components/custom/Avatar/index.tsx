import {
  Avatar as AvatarUI,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";

interface Props {
  role: "function" | "system" | "user" | "assistant" | "tool";
}

const Avatar = ({ role }: Props) => {
  const { user } = useUser();
  return (
    <AvatarUI className="h-8 w-8">
      <AvatarImage src={role === "user" ? user?.imageUrl : "/logo.svg"} />
      {role === "user" && (
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      )}
    </AvatarUI>
  );
};

export default Avatar;
