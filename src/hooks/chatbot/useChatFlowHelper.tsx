// import { MessageType } from "@/types/general_types";
// import parse from "html-react-parser";
// import { useEffect, useRef } from "react";
// import reactElementToJSXString from "react-element-to-jsx-string";
// import useChatFlowStore from "stores/chatFlowStore";
// // import elementToJSXString from "react-element-to-jsx-string";

// const serialize = (msg: MessageType) => ({
//   ...msg,
//   content: reactElementToJSXString(msg.content),
// });

// const deserialize = (msg: any) => ({
//   ...msg,
//   constent: parse(msg.constent),
// });

// const useChatFlowHelper = () => {
//   const { messages, serialized, addMessage, setSerialized } =
//     useChatFlowStore();

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const pushMessage = (msg: MessageType) => {
//     addMessage(msg);

//     const newSerialized = [...serialized, serialize(msg)];
//     setSerialized(newSerialized);
//   };

//   // restore messages from local storage
//   const restored = serialized.map(deserialize);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return {
//     messages,
//     serializedMessages: serialized,
//     restoredMessages: restored,
//     pushMessage,
//     messagesEndRef,
//   };
// };

// export default useChatFlowHelper;
