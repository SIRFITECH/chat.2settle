//   const handleKYCInfo = (chatInput: string) => {
//     if (greetings.includes(chatInput.trim().toLowerCase())) {
//       goToStep("start");
//       helloMenu(chatInput);
//     } else if (chatInput === "1") {
//       displayKYCInfo(addChatMessages, nextStep);
//     } else if (chatInput === "2") {
//       helloMenu("hi");
//       goToStep("start");
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

//   // GIVE USERS LINK TO REG
//   const handleRegKYC = (chatInput: string) => {
//     if (greetings.includes(chatInput.trim().toLowerCase())) {
//       goToStep("start");
//       helloMenu(chatInput);
//     } else if (chatInput === "1") {
//       displayRegKYC(addChatMessages, nextStep);
//     } else if (chatInput === "2") {
//       helloMenu("hi");
//       goToStep("start");
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

//   // GIVE USERS LINK TO REG
//   const handleThankForKYCReg = (chatInput: string) => {
//     if (greetings.includes(chatInput.trim().toLowerCase())) {
//       goToStep("start");
//       helloMenu(chatInput);
//     } else if (chatInput === "1") {
//       displayThankForKYCReg(addChatMessages, nextStep);
//       helloMenu("hi");
//     } else if (chatInput === "2") {
//       goToStep("start");
//       helloMenu("hi");
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
