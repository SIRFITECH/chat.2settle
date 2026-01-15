import React from "react";
import { MessageType } from "stores/chatStore";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const componentMap: Record<string, React.ComponentType<any>> = {
  ConnectButton: ConnectButton,
};

export const renderMessageContent = (msg: MessageType) => {
  if (msg.intent) {
    switch (msg.intent.kind) {
      case "text":
        return <p className="text-xs md:text-sm">{msg.intent.value}</p>;

      case "component": {
        const Comp = componentMap[msg.intent.name];
        if (!Comp) return null;
        return <Comp {...msg.intent.props} />;
      }
    }
  }

  // fallback (your current behavior)
  return typeof msg.content === "string" ? (
    <p className="text-xs md:text-sm">{msg.content}</p>
  ) : (
    msg.content
  );
};
