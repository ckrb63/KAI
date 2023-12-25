import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import MobileSidebar from "../Sidebar/mobile";

const Navigationbar = () => {
  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="justify-end flex w-full">
        <UserButton afterSignOutUrl="/"/>
      </div>
    </div>
  );
};

export default Navigationbar;
