"use client";

import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

import {
  ArrowDown,
  Code2,
  HistoryIcon,
  MessageSquare,
  Trash2Icon,
} from "lucide-react";

import Header from "@/components/custom/Header";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Loading from "@/components/custom/Loading";
import { cn } from "@/lib/utils";
import Avatar from "@/components/custom/Avatar";
import ReactMarkdown from "react-markdown";

// Markdown code hightlighter
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import {
  UserChatHistory,
  createChatAndHistory,
  deleteChatHistory,
  getChatHistoryList,
} from "@/lib/api/chat";
import { useAuth } from "@clerk/nextjs";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// TODO: hitory DB
const CodePage = () => {
  const [historyId, setHistoryId] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [historyList, setHistoryList] = useState<UserChatHistory[]>([]);
  const [side, setSide] = useState<"right" | "bottom">("right");
  const [isHistoryUpdated, setIsHistoryUpdated] = useState(true);

  const { userId } = useAuth();

  const asyncGetChatHistoryList = async () => {
    if (userId) {
      const historyListResponse = await getChatHistoryList(userId);
      setHistoryList(historyListResponse);
    }
  };

  const onClickHistoryCard = (history: UserChatHistory) => {
    const chats: ChatCompletionMessageParam[] = history.chatResponseList.map(
      (chat) => ({ content: chat.content, role: chat.role })
    );
    setMessages(chats);
    setHistoryId(history.historyId);
  };

  useEffect(() => {
    if (isHistoryUpdated) {
      asyncGetChatHistoryList();
      setIsHistoryUpdated(false);
    }
  }, [isHistoryUpdated]);

  useEffect(() => {
    const handleResize = () => {
      setSide(window.innerWidth <= 768 ? "bottom" : "right");
    };

    // 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // 초기 사이드 설정
    handleResize();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const controlTextArea = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      if (!event.shiftKey) {
        submit(currentMessage);
        event.preventDefault();
      }
    }
  };

  const onChangeTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
  };

  const createNewChat = () => {
    setHistoryId(0);
    setMessages([]);
    setQuestions([]);
  };

  const deleteHistoryAndRefetch = async (history: UserChatHistory) => {
    toast("기록이 삭제되었습니다.", {
      description: `${new Date().toDateString()}`,
    });
    await deleteChatHistory(history.historyId);
    await asyncGetChatHistoryList();
    createNewChat();
  };

  const submit = async (prompt: string) => {
    if (!userId) return;
    if (prompt.trim().length === 0) return;
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setQuestions([]);
      setIsLoading(true);
      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: `${prompt}`,
      };
      const newMessages = [...messages, userMessage];
      setMessages((current) => [...current, userMessage]);
      setCurrentMessage("");
      const response = await fetch("/api/code", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseJSON = await response.json();
      const lines = responseJSON.content.split("\n") as string[];
      const questionLines = lines.filter(
        (line) => line[line.length - 1] === "?"
      );
      const answer = lines
        .filter((line) => line[line.length - 1] !== "?")
        .join("\n");
      setQuestions(questionLines);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: answer },
      ]);
      let id = historyId;

      const chatResponse = await createChatAndHistory({
        userId,
        content: prompt,
        role: "user",
        historyId: id,
      });
      id = chatResponse.historyId;
      setHistoryId(id);
      createChatAndHistory({
        userId,
        role: "assistant",
        content: answer,
        historyId: id,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsHistoryUpdated(true);
    }
  };

  return (
    <div>
      <Header
        title="코딩"
        description="코드는 얘가 잘짭니다"
        icon={Code2}
        iconColor="text-gray-500"
        bgColor="bg-gray-500/10"
      />
      <div className="relative left-[50%] translate-x-[-50%] w-[90%] rounded-lg border p-4  focus-within:shadow-sm gap-2">
        {/* TODO: randomize placeholder */}
        <Textarea
          onKeyDown={controlTextArea}
          value={currentMessage}
          disabled={isLoading}
          onChange={onChangeTextarea}
          placeholder="줄바꿈을 하려면 Shift + Enter를 눌러주세요"
          className="resize-none flex-wrap w-full border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
        />
        <div className="flex justify-end">
          {messages.length > 0 && !isLoading && (
            <Button variant="outline" className="mr-1" onClick={createNewChat}>
              새로운 대화
            </Button>
          )}
          <Sheet>
            <SheetTrigger>
              <Button variant="outline" className="mr-3">
                기록
              </Button>
            </SheetTrigger>
            <SheetContent
              className="md:w-[50vw] md:h-screen overflow-y-scroll h-[60%]"
              side={side}
            >
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <HistoryIcon className="mr-2 text-gray-400" />
                  기록
                </SheetTitle>
                <SheetDescription>이전 대화 불러오기</SheetDescription>
              </SheetHeader>
              <div className="mt-5 space-y-3">
                {historyList.map((history) => (
                  <SheetClose asChild key={history.userId}>
                    <Card
                      className="hover:shadow transition cursor-pointer"
                      onClick={() => onClickHistoryCard(history)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg overflow-hidden text-ellipsis whitespace-nowrap">
                            {history.chatResponseList[0].content}
                          </CardTitle>
                          <Badge className="h-5 p-2">
                            <p>{history.chatResponseList.length}</p>
                          </Badge>
                        </div>
                        <CardDescription className="text-ellipsis overflow-hidden whitespace-nowrap">
                          {
                            history.chatResponseList[
                              history.chatResponseList.length - 1
                            ].content
                          }
                        </CardDescription>
                        <div className="flex justify-between items-center">
                          <div className="mt-0">
                            <p className="text-[10px] text-gray-500">
                              생성 {history.createdDate}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              수정 {history.lastModifiedDate}
                            </p>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Trash2Icon
                              onClick={(event) => {
                                event.stopPropagation();
                                deleteHistoryAndRefetch(history);
                              }}
                              className="w-5 text-gray-500"
                            />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Button
            disabled={isLoading}
            size="icon"
            onClick={() => submit(currentMessage)}
          >
            <ArrowDown />
          </Button>
        </div>
      </div>
      <div className="px-4 lg:px-8 flex flex-col flex-1">
        <div className="space-y-4 mt-4">
          {isLoading && <Loading />}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div key={`${message.content}`}>
                <div
                  className={cn(
                    "p-8 w-full flex items-center gap-x-8 rounded-lg",
                    message.role === "user"
                      ? "bg-white border border-black/10 flex-row-reverse"
                      : "bg-muted"
                  )}
                >
                  <Avatar role={message.role} />
                  <ReactMarkdown
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                          <pre {...props} />
                        </div>
                      ),
                      code(props) {
                        const { children, className, node, ref, ...rest } =
                          props;
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                          <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            language={match[1]}
                            style={materialDark}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code {...rest} className={className}>
                            {children}
                          </code>
                        );
                      },
                    }}
                    className="text-sm overflow-hidden leading-7"
                  >
                    {`${message.content}` || ""}
                  </ReactMarkdown>
                </div>
                {index === messages.length - 1 &&
                  questions.map((question) => (
                    <p
                      onClick={() => submit(question)}
                      key={question}
                      className="my-3 border p-2 rounded-md text-sm hover:underline cursor-pointer"
                    >
                      {question}
                    </p>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
