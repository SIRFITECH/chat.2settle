// Check if localchatId exists in localStorage
export const checkChatId = () => {
  return localStorage.getItem("chatId") !== null;
};

// Save chatId to localStorage
export const saveChatId = (id: string | number | undefined) => {
  if (id !== undefined) {
    console.log("ID before saving", id);
    localStorage.setItem("chatId", id.toString());
  } else {
    console.warn("Attempted to save undefined chat ID");
  }
};

export const getChatId = () => {
  const chatId = localStorage.getItem("chatId");
  return chatId ? chatId : null;
};

// Generate a new localchatId
export const generateChatId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

export const generateTransactionId = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
export const generateComplainId = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
export const generateGiftId = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  if (phoneNumber.startsWith("0")) {
    return "+234" + phoneNumber.slice(1);
  }
  return phoneNumber;
};

export const phoneNumberPattern = /^[0-9]{11}$/;

export const greetings = ["hi", "hello", "hey", "howdy"];
