// "use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useAccount } from "wagmi";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { SendIcon } from "lucide-react";
// import Image from "next/image";
// import {
//   format,
//   isToday,
//   isYesterday,
//   differenceInHours,
//   differenceInDays,
//   differenceInMonths,
// } from "date-fns";

// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { useSharedState } from "@/context/SharedStateContext";
// import { useChatNavigation } from "@/hooks/useChatNavigation";
// import Loader from "@/components/Loader";
// import { handleConversation } from "@/helpers/chatbot_logic/chat_logic";
// import { MessageType } from "@/types/general_types";

// export default function ChatBot({
//   isMobile,
//   onClose,
// }: {
//   isMobile: boolean;
//   onClose: () => void;
// }) {
//   const { address, isConnected } = useAccount();
//   const {
//     chatMessages,
//     addChatMessages,
//     currentStep,
//     nextStep,
//     prevStep,
//     goToStep,
//   } = useChatNavigation();
//   const { sharedState, setSharedState } = useSharedState();
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

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleChatInput();
//     }
//   };

//   const handleChatInput = useCallback(() => {
//     if (chatInput.trim()) {
//       const newMessage: MessageType = {
//         type: "outgoing",
//         content: <span>{chatInput}</span>,
//         timestamp: new Date(),
//       };
//       addChatMessages([newMessage]);
//       handleConversation(chatInput, {
//         currentStep,
//         nextStep,
//         prevStep,
//         goToStep,
//         addChatMessages,
//         setLoading,
//         sharedState,
//         setSharedState,
//       });
//       setChatInput("");
//     }
//   }, [
//     chatInput,
//     currentStep,
//     nextStep,
//     prevStep,
//     goToStep,
//     addChatMessages,
//     sharedState,
//     setSharedState,
//   ]);

//   const renderDateSeparator = (date: Date) => {
//     const now = new Date();
//     const hoursDiff = differenceInHours(now, date);
//     const daysDiff = differenceInDays(now, date);
//     const monthsDiff = differenceInMonths(now, date);

//     if (isToday(date)) return "Today";
//     if (isYesterday(date)) return "Yesterday";
//     if (daysDiff < 7) return format(date, "EEEE");
//     if (monthsDiff < 6) return format(date, "EEE. d MMM");
//     return format(date, "d MMM, yyyy");
//   };

//   const groupedMessages = chatMessages.reduce((groups, message) => {
//     const date = new Date(message.timestamp);
//     const dateString = format(date, "yyyy-MM-dd");
//     if (!groups[dateString]) {
//       groups[dateString] = [];
//     }
//     groups[dateString].push(message);
//     return groups;
//   }, {} as Record<string, MessageType[]>);

//   return (
//     <Card
//       className={`fixed ${
//         isMobile
//           ? "inset-0 top-10"
//           : "right-8 bottom-24 w-10/12 md:w-7/12 lg:w-6/12"
//       } bg-background rounded-lg shadow-lg overflow-hidden flex flex-col`}
//       style={{ height: isMobile ? "150%" : "80vh" }}
//     >
//       <CardHeader className="py-4 text-center bg-primary text-primary-foreground shadow relative z-10">
//         <div className="flex items-center justify-between px-4">
//           <span className="flex-shrink-0 w-8 h-8 bg-background rounded">
//             <Image
//               src="/waaa.png"
//               alt="Avatar"
//               width={32}
//               height={32}
//               className="rounded"
//             />
//           </span>
//           <h2 className="text-lg font-bold">2SettleHQ</h2>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={onClose}
//             aria-label="Close chat"
//           >
//             <SendIcon className="h-4 w-4" />
//           </Button>
//         </div>
//         {showDateDropdown && currentDate && (
//           <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-muted text-muted-foreground px-4 py-2 rounded-b-lg shadow-md text-sm transition-all duration-300 ease-in-out">
//             {currentDate}
//           </div>
//         )}
//       </CardHeader>
//       <CardContent className="flex-grow overflow-y-auto" ref={chatboxRef}>
//         <ul className="p-4 space-y-4">
//           {Object.entries(groupedMessages).map(([dateString, messages]) => (
//             <React.Fragment key={dateString}>
//               <li className="text-center text-sm text-muted-foreground my-2">
//                 {renderDateSeparator(new Date(dateString))}
//               </li>
//               {messages.map((msg, index) => (
//                 <li
//                   key={`${dateString}-${index}`}
//                   className={`flex ${
//                     msg.type === "incoming" ? "items-start" : "justify-end"
//                   }`}
//                 >
//                   {msg.type === "incoming" && (
//                     <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4 bg-background rounded self-end">
//                       <Image
//                         src="/waaa.png"
//                         alt="Avatar"
//                         width={32}
//                         height={32}
//                         className="rounded"
//                       />
//                     </span>
//                   )}
//                   <div className="flex flex-col max-w-[75%]">
//                     <div
//                       className={`p-2 md:p-3 rounded-lg ${
//                         msg.type === "incoming"
//                           ? "bg-muted text-muted-foreground rounded-bl-none"
//                           : "bg-primary text-primary-foreground rounded-br-none"
//                       }`}
//                     >
//                       <p className="text-xs md:text-sm">{msg.content}</p>
//                     </div>
//                     <span
//                       className={`text-xs text-muted-foreground mt-1 ${
//                         msg.type === "incoming" ? "self-start" : "self-end"
//                       }`}
//                     >
//                       {format(new Date(msg.timestamp), "h:mm a").toLowerCase()}
//                     </span>
//                   </div>
//                 </li>
//               ))}
//             </React.Fragment>
//           ))}
//           {loading && (
//             <div className="flex items-center">
//               <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4 mt-2 bg-background rounded">
//                 <Image
//                   src="/waaa.png"
//                   alt="Avatar"
//                   width={32}
//                   height={32}
//                   className="rounded"
//                 />
//               </span>
//               <div className="bg-muted relative left-1 top-1 rounded-bl-none pr-2 pt-2 pl-2 pb-1 md:pr-4 md:pt-4 md:pl-3 md:pb-2 rounded-lg mr-12 md:mr-48">
//                 <Loader />
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </ul>
//       </CardContent>
//       <CardFooter className="p-3 border-t border-border bg-background">
//         <div className="flex items-center w-full">
//           <Textarea
//             ref={textareaRef}
//             className="flex-grow resize-none"
//             placeholder="Enter a message..."
//             rows={1}
//             value={chatInput}
//             onChange={(e) => setChatInput(e.target.value)}
//             onKeyDown={handleKeyPress}
//           />
//           <Button
//             className="ml-2"
//             onClick={handleChatInput}
//             aria-label="Send message"
//           >
//             <SendIcon className="h-4 w-4" />
//           </Button>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
