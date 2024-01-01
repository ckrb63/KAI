import axios from "axios";
import axiosInstance from "./instance";

export const checkUser = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/user?userId=${userId}`);
    return response.data;
  } catch (error) {
    return false;
  }
};

export const createUser = async (userId: string) => {
  const response = await axios.post(`/user/${userId}`);
  return response.data;
};
