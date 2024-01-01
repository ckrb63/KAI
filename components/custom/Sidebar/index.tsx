"use client";

import { cn } from "@/lib/utils";
import {
  Code2Icon,
  ImagePlusIcon,
  LayoutDashboard,
  MessagesSquare,
  Music4Icon,
  Settings2,
  VideoIcon,
} from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const monsterrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "대시보드",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "채팅",
    icon: MessagesSquare,
    href: "/chat",
    color: "text-yellow-500",
  },
  {
    label: "이미지",
    icon: ImagePlusIcon,
    href: "/image",
    color: "text-pink-500",
  },
  {
    label: "코드",
    icon: Code2Icon,
    href: "/code",
    color: "text-gray-500",
  },
  // {
  //   label: "설정",
  //   icon: Settings2,
  //   href: "/settings",
  //   // color: "text-gray-500",
  // },
];

const Sidebar = () => {
  const pathName = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col w-full h-full bg-[#190d4e] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-12 h-12 mr-4 rounded-lg">
            <Image className="rounded-lg" fill alt="logo" src="logo.svg" />
          </div>
          <h1 className={cn("text-2xl font-bold", monsterrat.className)}>
            KAI
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathName === route.href ? "bg-white/10" : ""
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
