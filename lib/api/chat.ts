import axiosInstance from "./instance";

export type APIResponse<T> = {
  code: number;
  codeMsg: string;
  data: T;
};

type Chat = {
  chatId: number;
  content: string;
  role: "assistant" | "user" | "system";
  historyId: number;
  createdDate: string;
};

type ChatRequest = Omit<Chat, "chatId" | "createdDate"> & { userId: string };

type CreateChatHistorySigniture = ({
  userId,
  content,
  role,
  historyId,
}: ChatRequest) => Promise<Chat>;

type ChatHistory = Chat[];

export type UserChatHistory = {
  historyId: number;
  userId: string;
  chatResponseList: ChatHistory;
  createdDate: string;
  lastModifiedDate: string;
};

export const createChatAndHistory: CreateChatHistorySigniture = async ({
  content,
  role,
  userId,
  historyId = 0,
}) => {
  const response = await axiosInstance.post<APIResponse<Chat>>("/chat", {
    userId,
    content,
    role,
    historyId,
  });

  return response.data.data;
};

export const getChatHistoryList = async (userId: string) => {
  const response = await axiosInstance.get<APIResponse<UserChatHistory[]>>(
    `/chat/user?userId=${userId}`
  );

  return response.data.data;
};

export const deleteChatHistory = async (historyId: number) => {
  await axiosInstance.delete(`/chat/history?historyId=${historyId}`);
};
