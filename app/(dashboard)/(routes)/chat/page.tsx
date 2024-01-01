"use client";

import { ChangeEvent, useState } from "react";

import { ArrowDown, MessagesSquare, Send } from "lucide-react";

import Header from "@/components/custom/Header";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Empty from "@/components/custom/Empty";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "@/components/custom/Loading";
import { cn } from "@/lib/utils";
import Avatar from "@/components/custom/Avatar";

// TODO: hitory DB
const ChatPage = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
    console.log(currentMessage);
  };

  const submit = async () => {
    try {
      setIsLoading(true);
      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: currentMessage,
      };
      const newMessages = [...messages, userMessage];
      setMessages((current) => [...current, userMessage]);
      setCurrentMessage("");
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseJSON = await response.json();
      console.log(responseJSON);
      setMessages((current) => [...current, responseJSON]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header
        title="대화"
        description="발전된 대화형 모델을 경험하세요"
        icon={MessagesSquare}
        iconColor="text-yellow-500"
        bgColor="bg-yellow-500/10"
      />
      <div className="relative left-[50%] translate-x-[-50%] w-[90%] rounded-lg border p-4  focus-within:shadow-sm gap-2">
        {/* TODO: randomize placeholder */}
        <Textarea
          value={currentMessage}
          disabled={isLoading}
          onChange={onChangeTextarea}
          placeholder="기획서 작성하는 방법을 알려줘"
          className="resize-none flex-wrap w-full border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
        />
        <div className="flex justify-end">
          <Button disabled={isLoading} size="icon" onClick={submit}>
            <ArrowDown />
          </Button>
        </div>
      </div>
      <div className="px-4 lg:px-8 flex flex-col flex-1">
        <div className="space-y-4 mt-4">
          {isLoading && <Loading />}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                key={`${message.content}`}
                className={cn(
                  "p-8 w-full flex items-center gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10 flex-row-reverse"
                    : "bg-muted"
                )}
              >
                <Avatar role={message.role} />
                <p className="text-sm">{`${message.content}`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
