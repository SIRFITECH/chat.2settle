// import React from "react";

// const Junk = () => {
//   const [local] = React.useState((): string => {
//     if (typeof window !== "undefined") {
//       const from_localStorage = window.localStorage.getItem(
//         "user_selected_colour"
//       );
//       if (from_localStorage === null || from_localStorage === undefined) {
//         return "red";
//       }

//       return `${from_localStorage}` ? from_localStorage : "red";
//     }
//     return "";
//   });
//   const [selected, setSelected] = React.useState<string>(local);
//   const [selectedOption, setSelectedOption] = React.useState<string>();
//   const [selectedState, setSelectedState] = React.useState(false);

//   React.useEffect(() => {
//     window.localStorage.setItem("user_selected_colour", `${selected}`);

//     setSelectedOption(`${selected}`);
//   }, [local, selected]);

//   return (
//     <main className="bg-slate-900 text-white w-full h-screen p-10">
//       <button
//         onClick={() => setSelectedState((prev) => !prev)}
//         className="relative px-4 py-4 rounded-md text-black font-semibold bg-gray-400"
//       >
//         Select Your Code
//         {selectedState && (
//           <ul className="bg-[#3d3d3d] text-[1rem] text-white w-[10rem] z-[1] drop-shadow-lg absolute top-12 left-0 px-2 flex flex-col items-center py-2 rounded-md divide-y divide-white/20">
//             <li onClick={() => setSelected("red")} className="w-full py-2">
//               Red
//             </li>
//             <li onClick={() => setSelected("blue")} className="w-full py-2">
//               Blue
//             </li>
//             <li onClick={() => setSelected("yellow")} className="w-full py-2">
//               Yellow
//             </li>
//             <li onClick={() => setSelected("gray")} className="w-full py-2">
//               Gray
//             </li>
//             <li onClick={() => setSelected("green")} className="w-full py-2">
//               Green
//             </li>
//           </ul>
//         )}
//       </button>

//       <p>This is the color you picked: {selectedOption}</p>
//       <div
//         className={`w-64 h-32 rounded-md`}
//         style={{ backgroundColor: `${selectedOption}` }}
//       ></div>
//     </main>
//   );
// };

// export default Junk;

// working version that deserializes at every refresh

// import React from "react";
// import parse from "html-react-parser";
// import elementToJSXString from "react-element-to-jsx-string";

// const initialMessages = [
//   {
//     type: "incoming",
//     content: (
//       <span>
//         How far 👋
//         <br />
//         <br />
//         Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual assistance,{" "}
//         <br />
//         <b>Your wallet is not connected,</b> reply with:
//         <br />
//         <br />
//         1. To connect wallet <br />
//         2. To just continue
//       </span>
//     ),
//   },
// ];

// const serializeMessage = (message: {
//   type: string;
//   content: React.ReactNode;
// }) => {
//   return {
//     ...message,
//     content: elementToJSXString(message.content),
//   };
// };

// const deserializeMessage = (message: { type: string; content: string }) => {
//   return {
//     ...message,
//     content: parse(message.content),
//   };
// };

// const ChatComponent = () => {
//   const [local, setLocal] = React.useState<{
//     messages: { type: string; content: React.ReactNode }[];
//     step: number;
//   }>(() => {
//     if (typeof window !== "undefined") {
//       const fromLocalStorage = window.localStorage.getItem("chat_data");
//       if (fromLocalStorage) {
//         const parsedData = JSON.parse(fromLocalStorage);
//         return {
//           messages: parsedData.messages.map(deserializeMessage),
//           step: parsedData.step,
//         };
//       }
//     }
//     return { messages: initialMessages, step: 0 };
//   });

//   const [messages, setMessages] = React.useState(local.messages);
//   const [step, setStep] = React.useState(local.step);

//   React.useEffect(() => {
//     const chatData = {
//       messages: messages.map(serializeMessage),
//       step,
//     };
//     window.localStorage.setItem("chat_data", JSON.stringify(chatData));
//   }, [messages, step]);

//   const addMessage = (message: { type: string; content: React.ReactNode }) => {
//     setMessages((prevMessages) => [...prevMessages, message]);
//   };

//   const incrementStep = () => {
//     setStep((prevStep) => prevStep + 1);
//   };

//   return (
//     <main className="bg-slate-900 text-white w-full h-screen p-10">
//       <button
//         onClick={incrementStep}
//         className="relative px-4 py-4 rounded-md text-black font-semibold bg-gray-400"
//       >
//         Increment Step
//       </button>

//       <div className="mt-4">
//         {messages.map((msg, index) => (
//           <div key={index} className="p-2 my-2 bg-gray-700 rounded-md">
//             {msg.content}
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={() =>
//           addMessage({
//             type: "incoming",
//             content: <span>New message added at step {step}</span>,
//           })
//         }
//         className="relative px-4 py-4 mt-4 rounded-md text-black font-semibold bg-gray-400"
//       >
//         Add Message
//       </button>
//     </main>
//   );
// };

// export default ChatComponent;
import React from "react";
import parse from "html-react-parser";
import elementToJSXString from "react-element-to-jsx-string";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const initialMessages = [
  {
    type: "incoming",
    content: (
      <span>
        How far 👋
        <br />
        <br />
        Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual assistance,{" "}
        <br />
        <b>Your wallet is not connected,</b> reply with:
        <br />
        <br />
        1. To connect wallet <br />
        2. To just continue
        <br />
        <ConnectButton />
      </span>
    ),
  },
];

const sanitizeSerializedContent = (content: string) => {
  return content
    .replace(/\{['"]\s*['"]\}/g, "") // Remove {' '}
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Trim leading/trailing spaces
};

const serializeMessage = (message: {
  type: string;
  content: React.ReactNode;
}) => {
  return {
    ...message,
    content: sanitizeSerializedContent(elementToJSXString(message.content)),
  };
};
const deserializeMessage = (message: { type: string; content: string }) => {
  return {
    ...message,
    content: parse(message.content),
  };
};

const ChatComponent = () => {
  const [local, setLocal] = React.useState<{
    messages: { type: string; content: React.ReactNode }[];
    serializedMessages: { type: string; content: string }[];
    step: number;
  }>(() => {
    if (typeof window !== "undefined") {
      const fromLocalStorage = window.localStorage.getItem("chat_data");
      if (fromLocalStorage) {
        const parsedData = JSON.parse(fromLocalStorage);
        const deserializedMessages =
          parsedData.messages.map(deserializeMessage);
        return {
          messages: deserializedMessages,
          serializedMessages: parsedData.messages,
          step: parsedData.step,
        };
      }
    }
    const serializedInitialMessages = initialMessages.map(serializeMessage);
    return {
      messages: initialMessages,
      serializedMessages: serializedInitialMessages,
      step: 0,
    };
  });

  const [messages, setMessages] = React.useState(local.messages);
  const [serializedMessages, setSerializedMessages] = React.useState(
    local.serializedMessages
  );
  const [step, setStep] = React.useState(local.step);

  React.useEffect(() => {
    const chatData = {
      messages: serializedMessages,
      step,
    };
    window.localStorage.setItem("chat_data", JSON.stringify(chatData));
  }, [serializedMessages, step]);

  const addMessage = (message: { type: string; content: React.ReactNode }) => {
    const serializedMessage = serializeMessage(message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setSerializedMessages((prevMessages) => [
      ...prevMessages,
      serializedMessage,
    ]);
  };

  const incrementStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <main className="bg-slate-900 text-white w-full h-screen p-10">
      <button
        onClick={incrementStep}
        className="relative px-4 py-4 rounded-md text-black font-semibold bg-gray-400"
      >
        Increment Step
      </button>

      <div className="mt-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 my-2 bg-gray-700 rounded-md">
            {msg.content}
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          addMessage({
            type: "incoming",
            content: (
              <span>
                How far 👋
                <br />
                <br />
                Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual
                assistance, <br />
                <b>Your wallet is not connected,</b> reply with:
                <br />
                <br />
                1. To connect wallet <br />
                2. To just continue
                <br />
                <ConnectButton />
                {step}
              </span>
            ),
          });
          incrementStep();
        }}
        className="relative px-4 py-4 mt-4 rounded-md text-black font-semibold bg-gray-400"
      >
        Add Message
      </button>
    </main>
  );
};

export default ChatComponent;

// import React from "react";
// import parse from "html-react-parser";
// import elementToJSXString from "react-element-to-jsx-string";

// const initialMessages = [
//   {
//     type: "incoming",
//     content: (
//       <span>
//         How far 👋
//         <br />
//         <br />
//         Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual assistance,{" "}
//         <br />
//         <b>Your wallet is not connected,</b> reply with:
//         <br />
//         <br />
//         1. To connect wallet <br />
//         2. To just continue
//       </span>
//     ),
//   },
// ];

// const serializeMessage = (message: {
//   type: string;
//   content: React.ReactNode;
// }) => {
//   if (React.isValidElement(message.content)) {
//     return {
//       ...message,
//       content: elementToJSXString(message.content),
//     };
//   } else {
//     console.error("Invalid React element:", message.content);
//     return {
//       ...message,
//       content: "", // Handle invalid content appropriately
//     };
//   }
// };

// const deserializeMessage = (message: { type: string; content: string }) => {
//   try {
//     return {
//       ...message,
//       content: parse(message.content),
//     };
//   } catch (error) {
//     console.error("Failed to parse content:", message.content, error);
//     return {
//       ...message,
//       content: <span>Error retreiving this message</span>, // Handle parse errors appropriately
//     };
//   }
// };

// const ChatComponent = () => {
//   const [local, setLocal] = React.useState<{
//     messages: { type: string; content: React.ReactNode }[];
//     step: number;
//   }>(() => {
//     if (typeof window !== "undefined") {
//       const fromLocalStorage = window.localStorage.getItem("chat_data");
//       if (fromLocalStorage) {
//         const parsedData = JSON.parse(fromLocalStorage);
//         return {
//           messages: parsedData.messages.map(deserializeMessage),
//           step: parsedData.step,
//         };
//       }
//     }
//     return { messages: initialMessages, step: 0 };
//   });

//   const [messages, setMessages] = React.useState(local.messages);
//   const [step, setStep] = React.useState(local.step);

//   React.useEffect(() => {
//     const chatData = {
//       messages: messages.map(serializeMessage),
//       step,
//     };
//     window.localStorage.setItem("chat_data", JSON.stringify(chatData));
//   }, [messages, step]);

//   const addMessage = (message: { type: string; content: React.ReactNode }) => {
//     incrementStep();
//     setMessages((prevMessages) => [...prevMessages, message]);
//   };

//   const incrementStep = () => {
//     setStep((prevStep) => prevStep + 1);
//   };

//   return (
//     <main className="bg-slate-900 text-white w-full h-screen p-10">
//       <button
//         onClick={incrementStep}
//         className="relative px-4 py-4 rounded-md text-black font-semibold bg-gray-400"
//       >
//         Increment Step
//       </button>

//       <div className="mt-4">
//         {messages.map((msg, index) => (
//           <div key={index} className="p-2 my-2 bg-gray-700 rounded-md">
//             {msg.content}
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={() =>
//           addMessage({
//             type: "incoming",
//             content: <span>New message added at step {step}</span>,
//           })
//         }
//         className="relative px-4 py-4 mt-4 rounded-md text-black font-semibold bg-gray-400"
//       >
//         Add Message
//       </button>
//     </main>
//   );
// };

// export default ChatComponent;

// RETURNS A FOCUSED CHAT INPUT FIELD

// return (
//   <div className="fixed right-8 bottom-24 w-80 md:w-96 bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform scale-100">
//     <div
//       className="cursor-pointer p-4 bg-green-600 text-white text-center"
//       onClick={() => setIsOpen(!isOpen)}
//     >
//       {isOpen ? "Close" : "Open"} Chat
//     </div>

//     {isOpen && (
//       <div className="relative p-4 overflow-y-auto max-h-96">
//         <div className="space-y-4">
//           {chatMessages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex ${
//                 message.type === "incoming" ? "justify-start" : "justify-end"
//               }`}
//             >
//               <div
//                 className={`${
//                   message.type === "incoming"
//                     ? "bg-gray-200 text-gray-800"
//                     : "bg-green-600 text-white"
//                 } p-2 rounded-lg max-w-xs`}
//               >
//                 {message.content}
//               </div>
//             </div>
//           ))}
//           {loading && (
//             <div className="flex justify-center">
//               <Loader />
//             </div>
//           )}
//         </div>
//         <div ref={messagesEndRef} />
//       </div>
//     )}

//     {isOpen && (
//       <div className="p-4 border-t border-gray-300">
//         <textarea
//           ref={textareaRef}
//           value={chatInput}
//           onChange={(e) => setChatInput(e.target.value)}
//           onKeyDown={handleKeyPress}
//           placeholder="Type your message..."
//           rows={1}
//           className="w-full p-2 border rounded-md focus:outline-none resize-none"
//         />
//         <button
//           onClick={() => handleConversation(chatInput)}
//           className="bg-green-600 text-white px-4 py-2 mt-2 rounded-md"
//         >
//           <SendIcon />
//         </button>
//       </div>
//     )}
//   </div>
// );


// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// contract PaymentApproval {
//     address public owner;
//     mapping(address => bool) public permittedAddresses;

//     constructor(address[] memory _permittedAddresses) {
//         owner = msg.sender;
//         for (uint i = 0; i < _permittedAddresses.length; i++) {
//             permittedAddresses[_permittedAddresses[i]] = true;
//         }
//     }

//     modifier onlyOwner() {
//         require(msg.sender == owner, "Only owner can call this function");
//         _;
//     }

//     function addPermittedAddress(address _address) external onlyOwner {
//         permittedAddresses[_address] = true;
//     }

//     function removePermittedAddress(address _address) external onlyOwner {
//         permittedAddresses[_address] = false;
//     }

//     function isPermitted(address recipient) external view returns (bool) {
//         return permittedAddresses[recipient];
//     }
// }


