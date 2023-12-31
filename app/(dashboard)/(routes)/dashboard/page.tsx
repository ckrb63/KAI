"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Code2Icon,
  ImagePlusIcon,
  MessagesSquare,
  Music4,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "대화 시작하기",
    icon: MessagesSquare,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    href: "/chat",
  },
  {
    label: "이미지 생성하기",
    icon: ImagePlusIcon,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    href: "/image",
  },
  {
    label: "코드 생성하기",
    icon: Code2Icon,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    href: "/code",
  },
];

const DashboardPage = () => {
  const router = useRouter();
  
  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          AI로 문제를 해결하세요
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Explore the power of AI
        </p>
        <div className="px-4 md:px-20 lg:px-32 space-y-4">
          {tools.map((tool) => (
            <Card
              onClick={() => router.push(tool.href)}
              key={tool.href}
              className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center gap-x-4">
                <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                  <tool.icon className={cn("w-8 h-8", tool.color)} />
                </div>
                <div className="font-semibold">{tool.label}</div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
