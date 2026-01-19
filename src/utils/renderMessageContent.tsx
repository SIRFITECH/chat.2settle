import React from "react";
import { MessageType } from "stores/chatStore";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const componentMap: Record<string, React.ComponentType<any>> = {
  ConnectButton,
};

export const renderMessageContent = (msg: MessageType) => {
  const intent = msg.intent;

  return (
    <div className="flex flex-col gap-3">
      {/* Main message content */}
      {msg.content &&
        (typeof msg.content === "string" ? (
          <p className="text-xs md:text-sm">{msg.content}</p>
        ) : (
          <span>
            {msg.content}
          </span>
        ))}

      {/* Intent rendering */}
      {intent?.kind === "component" &&
        (() => {
          const Comp = componentMap[intent.name];
          if (!Comp) return null;

          return (
            <div className="flex justify-center">
              <Comp {...intent.props} />
            </div>
          );
        })()}

      {intent?.kind === "text" && (
        <p className="text-xs md:text-sm">{intent.value}</p>
      )}
    </div>
  );
};
// export const renderMessageContent = (msg: MessageType) => {
//   if (msg.intent) {
//     switch (msg.intent.kind) {
//       case "text":
//         return <p className="text-xs md:text-sm">{msg.intent.value}</p>;

//       case "component": {
//         const Comp = componentMap[msg.intent.name];
//         if (!Comp) return null;
//         return <Comp {...msg.intent.props} />;
//       }
//     }
//   }

//   // fallback (your current behavior)
//   return typeof msg.content === "string" ? (
//     <p className="text-xs md:text-sm">{msg.content}</p>
//   ) : (
//     <span className="text-xs md:text-sm">{msg.content}</span>
//   );
// };
