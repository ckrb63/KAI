"use client";

import { ChangeEvent, useEffect, useState } from "react";

import { ArrowDown, Code2, MessagesSquare, Send } from "lucide-react";

import Header from "@/components/custom/Header";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Empty from "@/components/custom/Empty";
import Loading from "@/components/custom/Loading";
import { cn } from "@/lib/utils";
import Avatar from "@/components/custom/Avatar";
import ReactMarkdown, { ExtraProps } from "react-markdown";

// Markdown code hightlighter
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { createChat, createHistory } from "@/lib/api/history";

// TODO: hitory DB
const CodePage = () => {
  const [historyId, setHistoryId] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {}, [historyId]);

  const onChangeTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
    console.log(currentMessage);
  };

  const submit = async (prompt: string) => {
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
      console.log(answer);
      setQuestions(questionLines);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: answer },
      ]);
      let id = historyId;
      console.log(id);
      if (id === "") {
        const historyResponse = await fetch("/api/code/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        id = await historyResponse.json();
        console.log(id);
        setHistoryId(id);
      }
      if (id && id.length > 0) {
        console.log(id, userMessage.role, prompt);
        await fetch("/api/code/history/chat", {
          method: "POST",
          body: JSON.stringify({
            historyId: id,
            role: userMessage.role,
            content: prompt,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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
          value={currentMessage}
          disabled={isLoading}
          onChange={onChangeTextarea}
          placeholder="파이썬으로 연결리스트를 구현해줘"
          className="resize-none flex-wrap w-full border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
        />
        <div className="flex justify-end">
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

          {messages.length === 0 && !isLoading && (
            <Empty color="text-yellow-500" label="no conversation yet!" />
          )}
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
