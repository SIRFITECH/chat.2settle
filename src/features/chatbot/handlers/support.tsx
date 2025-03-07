/**
 * handle compliants, reports and support messaging
 */

import {
  displayCustomerSupportWelcome,
  displayCustomerSupportAssurance,
  displayEnterTransactionId,
} from "@/menus/customer_support";
import { greetings } from "../helpers/ChatbotConsts";
import { helloMenu } from "./general";
import { MessageType } from "@/types/general_types";

// CUSTOMER SUPPORT SEQUENCE FUNCTIONS

// ALLOW USER TO USER THEIR TRANSACTION ID TO MAKE A COMPLAIN
export const handleCustomerSupportAssurance = (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  nextStep: (step: string) => void,
  prevStep: () => void,
  goToStep: (step: string) => void
) => {
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    goToStep("start");
    //   helloMenu(chatInput);
  } else if (chatInput === "0") {
    (() => {
      prevStep();
      displayCustomerSupportWelcome(addChatMessages, nextStep);
    })();
  } else if (chatInput === "1") {
    displayCustomerSupportAssurance(addChatMessages, nextStep);
    //   helloMenu("hi");
  } else if (chatInput === "2") {
    displayEnterTransactionId(addChatMessages, nextStep);
  } else {
    addChatMessages([
      {
        type: "incoming",
        content:
          "Invalid choice. You need to choose an action from the options",
        timestamp: new Date(),
      },
    ]);
  }
};

//   // ALLOW USERS ENTER TRANSACTION ID
//   const handleTransactionId = async (chatInput: string) => {
//     if (greetings.includes(chatInput.trim().toLowerCase())) {
//       goToStep("start");
//       helloMenu(chatInput);
//     } else if (chatInput !== "0") {
//       const transaction_id = chatInput.trim();
//       setLoading(true);
//       setSharedTransactionId(transaction_id);
//       const transactionExists = (await checkTranscationExists(transaction_id))
//         .exists;

//       console.log(
//         "User phone:",
//         (await checkTranscationExists(transaction_id)).user
//           ?.customer_phoneNumber
//       );

//       setLoading(false);
//       // IF TRANSACTION_ID EXIST IN DB,
//       if (transactionExists) {
//         displayMakeComplain(addChatMessages, nextStep);
//       } else {
//         addChatMessages([
//           {
//             type: "incoming",
//             content: "Invalid transaction_id. Try again",
//             timestamp: new Date(),
//           },
//         ]);
//       }
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content:
//             "Invalid choice. You need to choose an action from the options",
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   };

//   // MAKE COMPLAIN
//   const handleMakeComplain = async (chatInput: string) => {
//     if (greetings.includes(chatInput.trim().toLowerCase())) {
//       goToStep("start");
//       helloMenu(chatInput);
//     } else if (chatInput.trim() === "00") {
//       (() => {
//         goToStep("start");
//         helloMenu("hi");
//       })();
//     } else if (chatInput.trim() === "0") {
//       (() => {
//         prevStep();
//         displayEnterTransactionId(addChatMessages, nextStep);
//       })();
//     } else if (chatInput !== "0") {
//       const message = chatInput.trim();
//       const words = message.trim().split(/\s+/);
//       let validMessage = words.length < 100 ? true : false;
//       // IF TRANSACTION_ID EXIST IN DB,

//       if (validMessage) {
//         setLoading(true);
//         const complainId = generateComplainId();
//         const phone = (await checkTranscationExists(sharedTransactionId)).user
//           ?.customer_phoneNumber;
//         console.log("User phone number is:", phone);

//         await createComplain({
//           transaction_id: sharedTransactionId,
//           complain: message,
//           status: "pending",
//           Customer_phoneNumber: phone,
//           complain_id: complainId,
//         });
//         setLoading(false);
//         addChatMessages([
//           {
//             type: "incoming",
//             content:
//               "Your complain is noted.You can also reach out to our customer care. +2349069400430 if you don't want to wait",
//             timestamp: new Date(),
//           },
//         ]);
//         helloMenu("hi");
//         goToStep("start");
//       } else {
//         console.log("Invalid message length");
//         addChatMessages([
//           {
//             type: "incoming",
//             content:
//               "Invalid entry, Please enter your message in not more that 100 words",
//             timestamp: new Date(),
//           },
//         ]);
//         return;
//       }
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content:
//             "Invalid choice. You need to choose an action from the options",
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   };
//   // ENTER TRANSACTION ID TO COMPLETE TRANSACTION
//   const handleCompleteTransactionId = async (chatInput: string) => {
//     if (greetings.includes(chatInput.trim().toLowerCase())) {
//       goToStep("start");
//       helloMenu(chatInput);
//     } else if (chatInput.trim() === "0") {
//       (() => {
//         prevStep();
//         choiceMenu("2");
//       })();
//     } else if (chatInput === "1") {
//       displayEnterCompleteTransactionId(addChatMessages, nextStep);
//     } else if (chatInput === "2") {
//       console.log("Let's see what is going on HERE!!!");
//       displayEnterId(addChatMessages, nextStep, "Claim Gift");
//       setSharedPaymentMode("Claim Gift");
//     } else if (chatInput === "3") {
//       displayEnterId(addChatMessages, nextStep, "request");
//       setSharedPaymentMode("request");
//     }
//   };
