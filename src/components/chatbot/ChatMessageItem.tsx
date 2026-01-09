import React from "react";
import Image from "next/image";
// import { MessageType } from "@/types/general_types";
import { format } from "date-fns";
import { MessageType } from "stores/chatStore";
interface Props {
  msg: MessageType;
  dateString: string;
  index: number;
}

// const ChatMessageItem = ({ msg, dateString, index }: Props) => {
//   return (
//     <li
//       key={`${dateString}-${index}`}
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
// };

const ChatMessageItem = ({ msg, dateString, index }: Props) => {
  return (
    <li
      key={`${dateString}-${index}`}
      className={`flex ${
        msg.type === "incoming" ? "items-start" : "justify-end"
      }`}
    >
      {msg.type === "incoming" && (
        <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4 bg-white rounded self-end">
          <Image
            src="/waaa.png"
            alt="Avatar"
            width={32}
            height={32}
            className="rounded"
          />
        </span>
      )}

      <div className="flex flex-col max-w-[75%]">
        <div
          className={`p-2 md:p-3 rounded-lg ${
            msg.type === "incoming"
              ? "bg-gray-200 text-black rounded-bl-none"
              : "bg-blue-500 text-white rounded-br-none"
          }`}
        >
          {/* 🔥 KEY CHANGE */}
          {typeof msg.content === "string" ? (
            <p className="text-xs md:text-sm">{msg.content}</p>
          ) : (
            msg.content
          )}
        </div>

        <span
          className={`text-xs text-gray-500 mt-1 ${
            msg.type === "incoming" ? "self-end" : "self-start"
          }`}
        >
          {format(new Date(msg.timestamp), "h:mm a").toLowerCase()}
        </span>
      </div>
    </li>
  );
};

export default ChatMessageItem;
