"use client";

import { ChangeEvent, useState } from "react";

import {
  ArrowDown,
  Code2,
  Download,
  ImagePlus,
  MessagesSquare,
  Send,
} from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { amountOptions, resolutionOptions } from "./constants";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";

// TODO: hitory DB
const ImagePage = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [amount, setAmount] = useState("4");
  const [resolution, setResolution] = useState("256x256");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const onChangeTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
    console.log(currentMessage);
  };

  const onChangeAmount = (value: string) => {
    setAmount(value);
  };

  const onChangeResolution = (value: string) => {
    setResolution(value);
  };

  const submit = async () => {
    try {
      setIsLoading(true);
      setCurrentMessage("");
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify({ prompt: currentMessage, amount, resolution }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseJSON = await response.json();
      console.log(responseJSON);
      const urls = responseJSON.map((image: { url: string }) => image.url);
      console.log(urls);
      setImages(urls);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header
        title="이미지"
        description="이미지 뚝딱 만들어버리기"
        icon={ImagePlus}
        iconColor="text-pink-500"
        bgColor="bg-pink-500/10"
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
        <div className="md:flex md:justify-end">
          <Select
            disabled={isLoading}
            value={amount}
            onValueChange={onChangeAmount}
            defaultValue={amountOptions[0].value}
          >
            <SelectTrigger className="outline-none focus-visible:ring-0 focus-visible:ring-transparent mr-3 mb-2 md:mb-0">
              <SelectValue defaultValue={amountOptions[0].value} />
            </SelectTrigger>
            <SelectContent>
              {amountOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            disabled={isLoading}
            value={resolution}
            onValueChange={onChangeResolution}
            defaultValue={resolutionOptions[0].value}
          >
            <SelectTrigger className="outline-none focus-visible:ring-0 focus-visible:ring-transparent mr-3 mb-2 md:mb-0">
              <SelectValue defaultValue={resolutionOptions[0].value} />
            </SelectTrigger>
            <SelectContent>
              {resolutionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="w-full md:w-14"
            disabled={isLoading}
            onClick={submit}
          >
            {/* <ArrowDown /> */}
            <p>생성</p>
          </Button>
        </div>
      </div>
      <div className="px-4 lg:px-8 flex flex-col flex-1">
        <div className="space-y-4 mt-4">
          {isLoading && <Loading />}
          {images.length === 0 && !isLoading && (
            <Empty color="text-yellow-500" label="no conversation yet!" />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {images.map((src) => (
              <Card key={src} className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image alt="Image" fill src={src} />
                </div>
                <CardFooter className="p-2">
                  <Button
                    onClick={() => window.open(src)}
                    variant="secondary"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
