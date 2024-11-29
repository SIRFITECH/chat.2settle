// "use client";

// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
//   useMemo,
// } from "react";
// import Image from "next/image";
// import SendIcon from "@mui/icons-material/Send";
// import Loader from "./Loader";
// import { useAccount } from "wagmi";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import {
//   format,
//   isToday,
//   isYesterday,
//   differenceInHours,
//   differenceInDays,
//   differenceInMonths,
// } from "date-fns";
// import { useSharedState } from "../context/SharedStateContext";
// import { useChatNavigation } from "../hooks/useChatNavigation";
// import { MessageType } from "../types/general_types";
// import { handleConversation } from "@/chat_opt/conversationHandler";
// import { renderDateSeparator } from "@/chat_opt/chatDateSeperator";

// const Chat: React.FC<{ isMobile: boolean; onClose: () => void }> = ({
//   isMobile,
//   onClose,
// }) => {
//   const { address: wallet, isConnected: walletIsConnected } = useAccount();
//   const {
//     sharedRate,
//     setSharedRate,
//     // ... other shared state
//   } = useSharedState();

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

//   const [isOpen, setIsOpen] = useState(true);
//   const [chatInput, setChatInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showDateDropdown, setShowDateDropdown] = useState(false);
//   const [currentDate, setCurrentDate] = useState<string | null>(null);

//   const chatboxRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (isOpen && textareaRef.current) {
//       textareaRef.current.focus();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     const resizeObserver = new ResizeObserver((entries) => {
//       for (let entry of entries) {
//         const height = entry.contentRect.height;
//         const maxHeight = window.innerHeight * 0.75;
//         if (chatboxRef.current && height > maxHeight) {
//           chatboxRef.current.style.height = `${maxHeight}px`;
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

//   useEffect(() => {
//     if (chatMessages.length > 0) {
//       const latestMessage = chatMessages[chatMessages.length - 1];
//       const dateString = renderDateSeparator(new Date(latestMessage.timestamp));
//       setCurrentDate(dateString);
//       setShowDateDropdown(true);

//       const timer = setTimeout(() => {
//         setShowDateDropdown(false);
//       }, 3000);

//       return () => clearTimeout(timer);
//     }
//   }, [chatMessages]);

//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [chatMessages, scrollToBottom]);

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleConversation(chatInput, {
//         addChatMessages,
//         setChatInput,
//         setLoading,
//         currentStep,
//         nextStep,
//         prevStep,
//         goToStep,
//         // ... other necessary props
//       });
//     }
//   };

//   const groupedMessages = useMemo(() => {
//     return chatMessages.reduce((groups, message) => {
//       const dateString = format(new Date(message.timestamp), "yyyy-MM-dd");
//       if (!groups[dateString]) {
//         groups[dateString] = [];
//       }
//       groups[dateString].push(message);
//       return groups;
//     }, {} as Record<string, MessageType[]>);
//   }, [chatMessages]);

//   // Render functions
//   const renderHeader = () => (
//     <header className="py-4 text-center text-white bg-blue-500 shadow relative z-10">
//       <div className="flex items-center justify-between px-4">
//         <span className="flex-shrink-0 w-8 h-8 bg-white rounded">
//           <Image
//             src="/waaa.png"
//             alt="Avatar"
//             width={32}
//             height={32}
//             className="rounded"
//           />
//         </span>
//         <h2 className="text-lg font-bold">2SettleHQ</h2>
//         <button
//           onClick={onClose}
//           className="text-white"
//           aria-label="Close chat"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//       </div>
//       {showDateDropdown && currentDate && (
//         <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-200 text-gray-700 px-4 py-2 rounded-b-lg shadow-md text-sm transition-all duration-300 ease-in-out">
//           {currentDate}
//         </div>
//       )}
//     </header>
//   );

//   const renderMessage = (msg: MessageType, index: number) => (
//     <li
//       key={index}
//       className={`flex ${
//         msg.type === "incoming" ? "items-start" : "justify-end"
//       }`}
//     >
//       {msg.type === "incoming" && (
//         <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4 bg-white rounded self-end">
//           <Image
//             src="/waaa.png"
//             alt="Avatar"
//             width={32}
//             height={32}
//             className="rounded"
//           />
//         </span>
//       )}
//       <div className="flex flex-col max-w-[75%]">
//         <div
//           className={`p-2 md:p-3 rounded-lg ${
//             msg.type === "incoming"
//               ? "bg-gray-200 text-black rounded-bl-none"
//               : "bg-blue-500 text-white rounded-br-none"
//           }`}
//         >
//           <p className="text-xs md:text-sm">{msg.content}</p>
//         </div>
//         <span
//           className={`text-xs text-gray-500 mt-1 ${
//             msg.type === "incoming" ? "self-end" : "self-start"
//           }`}
//         >
//           {format(new Date(msg.timestamp), "h:mm a").toLowerCase()}
//         </span>
//       </div>
//     </li>
//   );

//   const renderChatInput = () => (
//     <div className="p-3 border-t border-gray-200 bg-white">
//       <div className="flex items-center">
//         <textarea
//           ref={textareaRef}
//           className="flex-grow pl-2 pr-2 py-2 border-none outline-none resize-none"
//           placeholder="Enter a message..."
//           rows={1}
//           spellCheck={false}
//           required
//           value={chatInput}
//           onChange={(e) => setChatInput(e.target.value)}
//           onKeyDown={handleKeyPress}
//         />
//         <button
//           className="ml-2 text-blue-500 cursor-pointer"
//           onClick={() =>
//             handleConversation(chatInput, {
//               addChatMessages,
//               setChatInput,
//               setLoading,
//               currentStep,
//               nextStep,
//               prevStep,
//               goToStep,
//               // ... other necessary props
//             })
//           }
//           aria-label="Send message"
//         >
//           <SendIcon />
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div
//       ref={chatboxRef}
//       className={`fixed ${
//         isMobile
//           ? "inset-0 top-10"
//           : "right-8 bottom-24 w-10/12 md:w-7/12 lg:w-6/12"
//       } bg-white rounded-lg shadow-lg overflow-hidden flex flex-col`}
//       style={{ height: isMobile ? "150%" : "80vh" }}
//     >
//       {renderHeader()}
//       <div className="flex-grow overflow-y-auto">
//         <ul className="p-4 space-y-4">
//           {Object.entries(groupedMessages).map(([dateString, messages]) => (
//             <React.Fragment key={dateString}>
//               <li className="date-separator text-center text-sm text-gray-500 my-2">
//                 {renderDateSeparator(new Date(dateString))}
//               </li>
//               {messages.map((msg, index) => renderMessage(msg, index))}
//             </React.Fragment>
//           ))}
//           {loading && (
//             <div className="flex items-center">
//               <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4 mt-2 bg-white rounded">
//                 <Image
//                   src="/waaa.png"
//                   alt="Avatar"
//                   width={32}
//                   height={32}
//                   className="rounded"
//                 />
//               </span>
//               <div className="bg-gray-200 relative left-1 top-1 rounded-bl-none pr-2 pt-2 pl-2 pb-1 md:pr-4 md:pt-4 md:pl-3 md:pb-2 rounded-lg mr-12 md:mr-48">
//                 <div className="flex justify-start">
//                   <Loader />
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </ul>
//       </div>
//       {renderChatInput()}
//     </div>
//   );
// };

// export default Chat;
