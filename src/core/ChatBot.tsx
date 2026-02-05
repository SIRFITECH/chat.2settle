"use client";

// import ChatHeader from "@/components/chatbot/ChatHeader";
// import ChatInput from "@/components/chatbot/ChatInput";
// import ChatMessages from "@/components/chatbot/ChatMessages";
// import ErrorBoundary from "@/components/social/telegram/TelegramError";
// import { withErrorHandling } from "@/components/withErrorHandling";
// import { greetings } from "@/features/chatbot/helpers/ChatbotConsts";
// import { useChatNavigation } from "@/hooks/chatbot/useChatNavigation";
// import { useChatUI } from "@/hooks/useChatUI";
// import { useGroupedMessages } from "@/hooks/useGroupedMessages";
// import { ChatBotProps } from "@/types/chatbot_types";
// import { renderDateSeparator } from "@/utils/chatDates";
// import { useEffect, useState } from "react";
// import { MessageType } from "stores/chatStore";

// const ChatBot = ({ isMobile, onClose, onError }: ChatBotProps) => {
//   const [chatInput, setChatInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showDateDropdown, setShowDateDropdown] = useState(false);
//   const [currentDate, setCurrentDate] = useState<string | null>(null);
//   const {
//     chatMessages,
//     serializedMessages,
//     currentStep,
//     stepHistory,
//     addChatMessages,
//     nextStep,
//     prevStep,
//     goToStep,
//   } = useChatNavigation();

//   const { chatboxRef, messagesEndRef, textareaRef, scrollToBottom } =
//     useChatUI();

//   const groupedMessages = useGroupedMessages(chatMessages);

//   useEffect(scrollToBottom, [chatMessages, scrollToBottom]);

//   useEffect(() => {
//     if (chatMessages.length === 0) return;
//     const latestMessage = chatMessages[chatMessages.length - 1];
//     setCurrentDate(renderDateSeparator(new Date(latestMessage.timestamp)));
//   }, [chatMessages]);

//   // date seperator badge for mobile and desktop
//   const dateSeperatorBadge = (dateString: string) => {
//     return (
//       <li
//         className={`date-separator text-center text-sm text-gray-900 my-2 mx-auto bg-gray-200 w-fit rounded-lg px-4 py-1 `}
//         data-date={dateString}
//       >
//         {renderDateSeparator(new Date(dateString))}
//       </li>
//     );
//   };

//   const layout = (
//     <>
//       <ChatHeader
//         onClose={onClose}
//         showDateDropdown={showDateDropdown}
//         currentDate={currentDate}
//       />

//       <ChatMessages
//         groupedMessages={groupedMessages}
//         chatMessages={chatMessages}
//         loading={loading}
//         dateSeperatorBadge={dateSeperatorBadge}
//         messagesEndRef={messagesEndRef}
//         chatboxRef={chatboxRef}
//       />

//       <ChatInput
//         textareaRef={textareaRef}
//         chatInput={chatInput}
//         onChange={(e) => setChatInput(e.target.value)}
//         onSubmit={handleConversation}
//       />
//     </>
//   );

//   return (
// <ErrorBoundary>
//   {isMobile ? (
//     <div className="fixed inset-0 flex flex-col bg-white">{layout}</div>
//   ) : (
//     <div
//       ref={chatboxRef}
//       className={`fixed ${
//         isMobile
//           ? "inset-0 top-10"
//           : "right-8 bottom-24 w-10/12 md:w-7/12 lg:w-6/12"
//       } bg-white rounded-lg shadow-lg overflow-hidden flex flex-col`}
//       style={{ height: isMobile ? "150%" : "80vh" }}
//     >
//       {layout}
//     </div>
//   )}
// </ErrorBoundary>
//   );
// };
// export default withErrorHandling(ChatBot);

import ErrorBoundary from "@/components/social/telegram/TelegramError";
import { withErrorHandling } from "@/components/withErrorHandling";
import ChatLayout from "@/hooks/chatbot/chatLayout";
import { useChatLogic } from "@/hooks/chatbot/useChatLogic";
import { useChatState } from "@/hooks/chatbot/useChatState";
import { useChatUI } from "@/hooks/useChatUI";
import { useGroupedMessages } from "@/hooks/useGroupedMessages";
import { ChatBotProps } from "@/types/chatbot_types";
import { useEffect } from "react";
import useChatStore from "stores/chatStore";

const ChatBot = ({ isMobile, onClose }: ChatBotProps) => {

  const {
    chatInput,
    setChatInput,
    messages,
    chatMessages,
    addChatMessages,
    currentDate,
  } = useChatState();
  const { loading } = useChatStore.getState();

  const { chatboxRef, messagesEndRef, textareaRef, scrollToBottom } =
    useChatUI();

  const groupedMessages = useGroupedMessages(chatMessages);

  const { handleConversation } = useChatLogic({
    addChatMessages,
    setChatInput,
    currentStep: "start",
    onError: (err: Error) => console.log(err),
  });

  useEffect(scrollToBottom, [chatMessages, scrollToBottom]);

  const layout = (
    <ChatLayout
      chatInput={chatInput}
      onChange={(e) => setChatInput(e.target.value)}
      onSubmit={handleConversation}
      chatMessages={chatMessages}
      groupedMessages={groupedMessages}
      loading={loading}
      dateSeperatorBadge={(dateString) => <li>{dateString}</li>}
      messagesEndRef={messagesEndRef}
      chatboxRef={chatboxRef}
      showDateDropdown={true}
      currentDate={currentDate}
      onClose={onClose}
      textareaRef={textareaRef}
    />
  );

  return (
    <ErrorBoundary>
      {isMobile ? (
        <div className="fixed inset-0 flex flex-col bg-white">{layout}</div>
      ) : (
        <div
          ref={chatboxRef}
          className={`fixed ${
            isMobile
              ? "inset-0 top-10"
              : "right-8 bottom-24 w-10/12 md:w-7/12 lg:w-6/12"
          } bg-white rounded-lg shadow-lg overflow-hidden flex flex-col`}
          style={{ height: isMobile ? "150%" : "80vh" }}
        >
          {layout}
        </div>
      )}
    </ErrorBoundary>
  );
};
export default withErrorHandling(ChatBot);

// import type { telegramUser } from "@/types/telegram_types";
// import ChatHeader from "@/components/chatbot/ChatHeader";
// import ChatInput from "@/components/chatbot/ChatInput";
// import ChatMessages from "@/components/chatbot/ChatMessages";
// import ErrorBoundary from "@/components/social/telegram/TelegramError";
// import { withErrorHandling } from "@/components/withErrorHandling";
// import { ChatBotProps } from "@/types/chatbot_types";
// import { generateChatId, getChatId } from "@/utils/utilities";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {
//   differenceInDays,
//   differenceInHours,
//   differenceInMonths,
//   format,
//   isToday,
//   isYesterday,
// } from "date-fns";
// import { MessageType } from "stores/chatStore";

// const ChatBot = ({ isMobile, onClose, onError }: ChatBotProps) => {
//   // CHATBOT STATE AND LOGIC
//   const [chatId, setChatId] = useState("");
//   const [chatInput, setChatInput] = useState("");
//   const [chatMessages, setChatMessages] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showDateDropdown, setShowDateDropdown] = useState(false);
//   const [currentDate, setCurrentDate] = useState<string | null>(null);
//   const [isOpen, setIsOpen] = useState(true);
//   const [telegramUser, setTelegramUser] = useState<telegramUser | null>(null);
//   const [isTelUser, setIsTelUser] = useState(false);

//   // refs
//   const chatboxRef = useRef<HTMLDivElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const observerRef = useRef<IntersectionObserver | null>(null);

//   // Observer for chatbox resizing
//   useEffect(() => {
//     const resizeObserver = new ResizeObserver((entries) => {
//       for (const entry of entries) {
//         const height = entry.contentRect.height;
//         const maxHeight = window.innerHeight * 0.75;
//         if (chatboxRef.current) {
//           if (height > maxHeight) {
//             chatboxRef.current.style.height = `${maxHeight}px`;
//           }
//         }
//       }
//     });

//     if (chatboxRef.current) {
//       resizeObserver.observe(chatboxRef.current);
//     }

//     return () => {
//       if (chatboxRef.current) {
//         resizeObserver.unobserve(chatboxRef.current);
//       }
//     };
//   }, []);

//   const scrollToBottom = useCallback(() => {
//     if (!messagesEndRef.current) return;

//     // Use requestAnimationFrame to avoid forced reflow
//     requestAnimationFrame(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     });
//   }, []);

//   useEffect(() => {
//     // Debounce scroll updates for rapid message additions
//     const timeoutId = setTimeout(scrollToBottom, 100);
//     return () => clearTimeout(timeoutId);
//   }, [chatMessages, scrollToBottom]);

//   useEffect(() => {
//     if (isOpen && textareaRef.current) {
//       textareaRef.current.focus();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     () => setIsOpen(isOpen);
//   });

//   const initializeChatId = () => {
//     // we now set the telegram chatId to the chatId if it a telegram user
//     const existingChatId = isTelUser
//       ? telegramUser?.id.toString()
//       : getChatId();
//     // setSharedChatId(`${existingChatId}`);

//     if (!existingChatId) {
//       const newChatId = isTelUser
//         ? // ? telegramUser?.id ?? generateChatId()
//           telegramUser?.id.toString()
//         : generateChatId();

//       if (newChatId !== undefined) {
//         // Ensure newChatId is defined
//         // saveChatId(newChatId);
//         setChatId(newChatId.toString());
//       } else {
//         console.warn("Failed to generate a new chat ID.");
//       }
//     } else {
//       if (existingChatId !== chatId) {
//         setChatId(existingChatId);
//       }
//     }
//   };

//   useEffect(() => {
//     initializeChatId();
//   }, [chatId]);

//   useEffect(() => {
//     const dateSeparators = document.querySelectorAll(".date-separator");
//     dateSeparators.forEach((separator) => {
//       if (observerRef.current) {
//         observerRef.current.observe(separator);
//       }
//     });
//   }, [chatMessages]);

//   // load messages on page load or refresh
//   useEffect(() => {
//     if (chatMessages.length > 0) {
//       const latestMessage = chatMessages[chatMessages.length - 1];
//       const dateString = renderDateSeparator(new Date(latestMessage.timestamp));
//       setCurrentDate(dateString);
//       setShowDateDropdown(true);

//       const timer = setTimeout(() => {
//         setShowDateDropdown(false);
//       }, 3000); // 3 seconds

//       return () => clearTimeout(timer);
//     }
//   }, [chatMessages]);

//   const renderDateSeparator = (date: Date) => {
//     const now = new Date();
//     const hoursDiff = differenceInHours(now, date);
//     const daysDiff = differenceInDays(now, date);
//     const monthsDiff = differenceInMonths(now, date);

//     if (isToday(date)) {
//       return "Today";
//     } else if (isYesterday(date)) {
//       return "Yesterday";
//     } else if (daysDiff < 7) {
//       return format(date, "EEEE");
//     } else if (monthsDiff < 6) {
//       return format(date, "EEE. d MMM");
//     } else {
//       return format(date, "d MMM, yyyy");
//     }
//   };

//   const groupedMessages = useMemo(
//     () =>
//       chatMessages.reduce((groups, message) => {
//         const dateString = format(new Date(message.timestamp), "yyyy-MM-dd");
//         if (!groups[dateString]) {
//           groups[dateString] = [];
//         }
//         groups[dateString].push(message);
//         return groups;
//       }, {} as Record<string, MessageType[]>),
//     [chatMessages]
//   );

//   // centralize the date seperator badge for both mobile and desktop
//   const dateSeperatorBadge = (dateString: string) => {
//     return (
//       <li
//         className={`date-separator text-center text-sm text-gray-900 my-2 mx-auto bg-gray-200 w-fit rounded-lg px-4 py-1 `}
//         data-date={dateString}
//       >
//         {renderDateSeparator(new Date(dateString))}
//       </li>
//     );
//   };

//   const handleConversation = async (chatInput: string): Promise<void> => {
//     // placeholder logic
//     console.log("User submitted:", chatInput);
//   };

//   // handle chat key press
//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       // Trigger conversation handling
//       console.log("User submitted:", chatInput);
//     }
//   };

//   // CHATBOT
//   return (
//     <ErrorBoundary>
//       {isMobile ? (
//         <div className="fixed inset-0 flex flex-col bg-white">
//           <ChatHeader
//             onClose={onClose}
//             showDateDropdown={showDateDropdown}
//             currentDate={currentDate}
//           />
//           <ChatMessages
//             groupedMessages={groupedMessages}
//             chatMessages={chatMessages}
//             loading={loading}
//             dateSeperatorBadge={dateSeperatorBadge}
//             messagesEndRef={messagesEndRef}
//             chatboxRef={chatboxRef}
//           />

//           <ChatInput
//             textareaRef={textareaRef}
//             onChange={(e) => setChatInput(e.target.value)}
//             // handleKeyPress={handleKeyPress}
//             onSubmit={handleConversation}
//             chatInput={chatInput}
//           />
//         </div>
//       ) : (
//         <div
//           ref={chatboxRef}
//           className={`fixed ${
//             isMobile
//               ? "inset-0 top-10"
//               : "right-8 bottom-24 w-10/12 md:w-7/12 lg:w-6/12"
//           } bg-white rounded-lg shadow-lg overflow-hidden flex flex-col`}
//           style={{ height: isMobile ? "150%" : "80vh" }}
//         >
//           <ChatHeader
//             onClose={onClose}
//             showDateDropdown={showDateDropdown}
//             currentDate={currentDate}
//           />
//           <ChatMessages
//             groupedMessages={groupedMessages}
//             chatMessages={chatMessages}
//             loading={loading}
//             dateSeperatorBadge={dateSeperatorBadge}
//             messagesEndRef={messagesEndRef}
//             chatboxRef={chatboxRef}
//           />
//           <ChatInput
//             textareaRef={textareaRef}
//             onChange={(e) => setChatInput(e.target.value)}
//             // handleKeyPress={handleKeyPress}
//             onSubmit={handleConversation}
//             chatInput={chatInput}
//           />
//         </div>
//       )}
//     </ErrorBoundary>
//   );
// };

// export default withErrorHandling(ChatBot);
