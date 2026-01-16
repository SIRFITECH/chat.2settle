// // transaction.machine.ts
// export const transactionMachine = {
//   initial: "transactionId",

//   states: {
//     transactionId: {
//       on: {
//         NEXT: {
//           target: "continiueWithId",
//         },
//         PREV: {
//           target: "#chatbotSteps.chooseAction",
//         },
//       },
//     },

//     continiueWithId: {
//       type: "parallel",
//       states: {
//         claimGift: {
//           on: {
//             NEXT: {
//               target: "#chatbotSteps.transaction.entreTrxId",
//               guard: { type: "claimGift" },
//             },
//             PREV: {
//               target: "#chatbotSteps.transaction.transactionId",
//               guard: { type: "from claimGift" },
//             },
//           },
//         },

//         fullFillRequest: {
//           on: {
//             NEXT: {
//               target: "#chatbotSteps.transaction.entreTrxId",
//               guard: { type: "fullFillRequest" },
//             },
//             PREV: {
//               target: "#chatbotSteps.transaction.transactionId",
//               guard: { type: "from fullFillRequest" },
//             },
//           },
//         },
//       },
//     },

//     entreTrxId: {
//       on: {
//         PREV: [
//           {
//             target: "#chatbotSteps.transaction.continiueWithId.claimGift",
//             guard: { type: "from claimGift" },
//           },
//           {
//             target: "#chatbotSteps.transaction.continiueWithId.fullFillRequest",
//             guard: { type: "from fullFillRequest" },
//           },
//         ],
//         NEXT: [
//           {
//             target: "#chatbotSteps.banking.enterBankSearchWord",
//             guard: { type: "claimGift" },
//           },
//           {
//             target: "#chatbotSteps.payment.payOptions",
//             guard: { type: "fullFillRequest" },
//           },
//         ],
//       },
//     },
//   },
// };
