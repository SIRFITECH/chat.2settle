import {
  fetchMerchantRate,
  fetchProfitRate,
  fetchRate,
} from "@/helpers/api_calls";
import { formatCurrency } from "@/helpers/format_currency";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  differenceInMonths,
} from "date-fns";
import {
  generateChatId,
  getChatId,
  saveChatId,
} from "../../../utils/utilities";
import { telegramUser } from "@/types/telegram_types";

export const renderDateSeparator = (date: Date) => {
  const now = new Date();
  const daysDiff = differenceInDays(now, date);
  const monthsDiff = differenceInMonths(now, date);

  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (daysDiff < 7) {
    return format(date, "EEEE");
  } else if (monthsDiff < 6) {
    return format(date, "EEE. d MMM");
  } else {
    return format(date, "d MMM, yyyy");
  }
};
export const initialMessages = [
  {
    type: "incoming",
    content: (
      <span>
        How far👋
        <br />
        <br />
        Say 'hi' to chat me up!
      </span>
    ),
    timestamp: new Date(),
    isComponent: false,
  },
];

export const componentMap: { [key: string]: React.ComponentType<any> } = {
  ConnectButton: ConnectButton,
  // Add other components here as needed
};

export const greetings = ["hi", "hello", "hey", "howdy"];

// Replace multiple sequential API calls with Promise.all to batch API calls

export const fetchData = async (
  setRate: React.Dispatch<React.SetStateAction<string>>,
  setFormattedRate: React.Dispatch<React.SetStateAction<string>>,
  setMerchantRate: React.Dispatch<React.SetStateAction<string>>,
  setProfitRate: React.Dispatch<React.SetStateAction<string>>,
  setSharedRate: (rate: string) => void
) => {
  try {
    const [fetchedRate, fetchedMerchantRate, fetchedProfitRate] =
      await Promise.all([fetchRate(), fetchMerchantRate(), fetchProfitRate()]);

    // Batch state updates
    const updates = {
      rate: fetchedRate.toString(),
      formattedRate: formatCurrency(fetchedRate.toString(), "NGN", "en-NG"),
      merchantRate: formatCurrency(
        fetchedMerchantRate.toString(),
        "NGN",
        "en-NG"
      ),
      profitRate: formatCurrency(fetchedProfitRate.toString(), "NGN", "en-NG"),
    };

    // Update all states at once
    setRate(updates.rate);
    setFormattedRate(updates.formattedRate);
    setMerchantRate(updates.merchantRate);
    setProfitRate(updates.profitRate);
    setSharedRate(updates.rate);
  } catch (error) {
    console.error("Failed to fetch rates:", error);
  }
};

export const initializeChatId = (
  isTelUser: boolean,
  chatId: string,
  telegramUser: telegramUser | null,
  setSharedChatId: (rate: string) => void,
  setChatId: React.Dispatch<React.SetStateAction<string>>
) => {
  // we now set the telegram chatId to the chatId if it a telegram user
  const existingChatId = isTelUser ? telegramUser?.id.toString() : getChatId();
  setSharedChatId(`${existingChatId}`);

  if (!existingChatId) {
    const newChatId = isTelUser
      ? // ? telegramUser?.id ?? generateChatId()
        telegramUser?.id.toString()
      : generateChatId();

    if (newChatId !== undefined) {
      // Ensure newChatId is defined
      saveChatId(newChatId);
      setChatId(newChatId.toString());
    } else {
      console.warn("Failed to generate a new chat ID.");
    }
  } else {
    if (existingChatId !== chatId) {
      setChatId(existingChatId);
    }
  }
};
