import api from "../../api-client"
export const createTransaction = async (user: any): Promise<any> => {
  try {
    const response = await api.post<any>(
      `/api/transaction/create_transaction`,
      user
    );
    console.log("Use transaction created successfully");
    return response.data;
  } catch (error) {
    console.error("Error storing user data:", error);
    throw new Error("Failed to store user data");
  }
};