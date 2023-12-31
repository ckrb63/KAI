import axios from "axios";

export const checkUser = async (userId: string) => {
  try {
    const response = await axios.get(
      `https://www.qa.delgo.pet/api/user?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    return false;
  }
};

export const createUser = async (userId: string) => {
  const response = await axios.post(
    `https://www.qa.delgo.pet/api/user/${userId}`
  );
  return response.data;
};
