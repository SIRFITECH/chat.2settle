// export const reportingMachine = {
//   type: "parallel",
//   states: {
//     trackTransaction: {
//       on: {
//         PREV: {
//           target: "#chatbotSteps.chooseAction",
//           guard: { type: "trackTransaction" },
//         },
//         NEXT: {
//           target: "#chatbotSteps.reporterName",
//           guard: { type: "trackTransaction" },
//         },
//       },
//     },

//     stolenFounds: {
//       on: {
//         PREV: {
//           target: "#chatbotSteps.chooseAction",
//           guard: { type: "stolenFunds" },
//         },
//         NEXT: {
//           target: "#chatbotSteps.reporterName",
//           guard: { type: "stolenFunds" },
//         },
//       },
//     },

//     fraud: {
//       on: {
//         PREV: {
//           target: "#chatbotSteps.chooseAction",
//           guard: { type: "fraud" },
//         },
//         NEXT: {
//           target: "#chatbotSteps.reporterName",
//           guard: { type: "fraud" },
//         },
//       },
//     },
//   },
// };

