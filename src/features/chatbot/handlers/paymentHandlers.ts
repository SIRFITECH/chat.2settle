// HANDLE TRANSFER MONEY MENU
type PaymentHandlerType = {
  chatInput: string;
  setSharedWallet: React.Dispatch<React.SetStateAction<string>>;
};
export const handleTransferMoney = ({
  chatInput,
  setSharedWallet,
}: PaymentHandlerType) => {};
//   const handleTransferMoney = (chatInput: string) => {
//     setSharedWallet("");
//     if (greetings.includes(chatInput.trim().toLowerCase())) {
//       goToStep("start");
//       helloMenu(chatInput);
//     } else if (chatInput === "0") {
//       prevStep();
//       welcomeMenu();
//     } else if (chatInput === "1") {
//       setSharedPaymentMode("transferMoney");
//       displayTransferMoney(addChatMessages);
//       nextStep("estimateAsset");
//     } else if (chatInput === "2") {
//       displayTransferMoney(addChatMessages);
//       setSharedPaymentMode("Gift");

//       nextStep("estimateAsset");
//     } else if (chatInput === "3") {
//       displayPayIn(
//         addChatMessages,
//         "Naira",
//         sharedRate,
//         "",
//         "",
//         sharedPaymentMode
//       );
//       setSharedEstimateAsset("Naira");
//       nextStep("enterBankSearchWord");

//       setSharedPaymentMode("request");
//     } else if (sharedPaymentMode.toLowerCase() === "request") {
//       displayTransferMoney(addChatMessages);
//       nextStep("estimateAsset");
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: "Invalid choice. Say 'Hi' or 'Hello' to start over",
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   };
