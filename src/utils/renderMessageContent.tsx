import React from "react";
import { MessageType } from "stores/chatStore";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ConfirmAndProceedButton from "@/hooks/chatbot/confirmButtonHook";

const componentMap: Record<string, React.ComponentType<any>> = {
  ConnectButton,
  ConfirmAndProceedButton,
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
          <span>{msg.content}</span>
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
