// import { bankingMachine } from "./banking.machine";
// import { onboardingMachine } from "./onboarding.machine";
// import { machineSetup } from "./setup";
// import { paymentMachine } from "./payment.machine";
// import { reportingMachine } from "./reporting_machine";
// import { supportMachine } from "./support.machine";
// import { transactCryptoMachine } from "./transactCrypto.machine";
// import { transactionMachine } from "./transaction.machine";
// import { assign, createActor } from "xstate";
// import { steps } from "./steps";
// import { greetings } from "@/features/chatbot/helpers/ChatbotConsts";

// interface Ctx {
//   currentStepIndex: number;
//   nextStepIndex: number;
//   prevStepIndex: number;
// }

// type Events = { type: "NEXT" } | { type: "PREV" } | { type: "RESET" };
// export const chatbotMachine = machineSetup.createMachine({
//   /** @xstate-layout N4IgpgJg5mDOIC5QGMAWBDALgIwPaYGVMwAHWAOlk3QCdMBiAYQAkBBAFQH0BJAOQAUAquwDaABgC6iUCVywAlpnm4AdtJAAPRAHZtY8gBYAbAA5tAZnNGAjAE5tNgDQgAnogPaD5a0d8H-5mIm9tYAvqHOaFh4hMRklNR0TGxcfEKi1lJIILIKSqrqWggWJuTm1gBMBiY2JgaWtgbObggm1t6+puYVRtoV5fbhkRg4+ESkFFS0DCwcPALCIhVZMnKKymrZRdZiHuQ1xgYVYtbWnmIVze525P0etraWYka7-UMgUaOxE+TIqipgZCYADq6AANmCwDMUvN0uIVjk1vlNqAigZbPpbD5TLp0dU6lcEAYduRtFijAYAKynSx1MIRD4jGLjeJ-FQAoGgiFQ5JzNKLTLqXLrApbHTmUrlKo1ax1BpNVyIcwWDp+SmUioVMxGSnvT7MuIUNkckHgyHQvkLUTLIVIjaFcWSyrVWr1cyNQlHczkToU9EOEw1Ex6pljQ2-VC4ORgVhAja81JW+G2vL2sUITXtKxUmoY57UvqE3y2Uno2y9CraM69EPRMM-NBR2AxuOqBOwgUI4XIh0ZipZimU3NifNnS6KjMncjk3rWSkGMRWcvmWtfFlGyPR2PI9v861du2i1GITNlQfD0eFicVDWGbF6B71Mm2VcGn6YGjoFSwABmYBoACyqhgC4u5JpIKYiiimiOmUzoynK7oKi0GpeL69SBuiYgWK+9bxB+X6-v+QEAqBsyJnCgrZN2abHsUEpwdKrryoSlLaJSqqUrYFSNHYI5GLh3z4Z+37oECjA0C4JCYLgYFwhB1GHtBRQlIxLqym6HoTkYN4+p0RxkjxWqCeu5AEaJ4mSdJsnkR2GQHqmR4wfRTpMRpLHaQ4qpGNxFLuuqK7vCouAQHA6j6nh8CKY5ymIAAtEYhJxRxDypWlaV9CZ4ZTHQkE9umpyatO5xztY+LcdonqeKS5j3GYdQ2FSuoMhFQlGv8gKmtymB5bRzmUoEZTznOxLBL0nier4tzkv4lK9EhBhZQ2m7NtufU0U5aLji0OraD6qUauU57aEtwmEX+gHAS0qwxb2GqlIulQWMcgRnKxPm3GWJjUjp7GaqdFDmbAYmYBJUkyb1m2IBqRhqRibEXJYyGIL0+hVA8FZVg4J3hKEQA */
//   id: "chatbotSteps",

//   context: {
//     currentStepIndex: 0,
//     nextStepIndex: 1,
//     prevStepIndex: 0,
//   },
//   initial: steps[0],

//   states: {
//     start: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "connectWallet",
//             guard: ({ event }) => {
//               if (event.value === "1") {
//                 console.log(
//                   "event: we are going to connectWallet",
//                   event.value
//                 );
//               }
//               return event.value === "1";
//             },
//           },
//           {
//             guard: ({ event }) => {
//               if (event.value === "2") {
//                 console.log("event: start", event.value);
//               }
//               return event.value === "2";
//             },
//             target: "chooseAction",
//           },

//           {
//             guard: ({ event }) => {
//               if (greetings.includes(event.value)) {
//                 console.log("event: start wants to reenter", event.value);
//               }
//               return greetings.includes(event.value);
//             },
//             target: "start",
//             reenter: true,
//           },
//         ],
//       },
//     },
//     connectWallet: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "connectWallet",
//             guard: ({ event }) => {
//               console.log("event rendering connectWallet: ", event.value);
//               return event.value == "connected";
//             },
//           },
//           {
//             target: "start",
//             guard: ({ event }) => {
//               console.log("event going back from connectWallet: ", event.value);
//               return event.value == "0";
//             },
//           },
//           {
//             guard: ({ event }) => {
//               if (greetings.includes(event.value)) {
//                 console.log(
//                   "event: connectWallet wants to return to start",
//                   event.value
//                 );
//               }
//               return greetings.includes(event.value);
//             },
//             target: "start",
//           },
//         ],
//       },
//     },

//     chooseAction: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "transactCrypto",
//             guard: ({ event }) => event.value === "1",
//           },
//           // {
//           //   target: "requestPayCard",
//           //   guard: ({ event }) => event.value === "2",
//           // },
//           // {
//           //   target: "support",
//           //   guard: ({ event }) => event.value === "3",
//           // },
//           // {
//           //   target: "transactionId",
//           //   guard: ({ event }) => event.value === "4",
//           // },
//           // {
//           //   target: "reportly",
//           //   guard: ({ event }) => event.value === "5",
//           // },
//           {
//             target: "start",
//             guard: ({ event }) => event.value === "0",
//           },
//           {
//             guard: ({ event }) => greetings.includes(event.value),
//             target: "start",
//           },
//         ],
//       },
//     },

//     transferMoney: {
//       on: {
//         CHAT_INPUT: [
//           {
//             guard: ({ event }) => greetings.includes(event.value),
//             target: "start",
//           },
//           {
//             guard: ({ event }) => greetings.includes(event.value),
//             target: "start",
//           },
//         ],
//       },

//       // on: {
//       //   NEXT: [
//       //     {
//       //       target: "transferMoney",
//       //       // guard: { type: "transactCrypto" },
//       //     },
//       //     // {
//       //     //   target: "requestPayCard",
//       //     //   // guard: { type: "requestPayCard" },
//       //     // },
//       //     // {
//       //     //   target: "support",
//       //     //   guard: { type: "customerSupport" },
//       //     // },
//       //     // {
//       //     //   target: "reporting",
//       //     //   guard: { type: "reportly" },
//       //     // },
//       //     // {
//       //     //   target: "transaction.continueWithId",
//       //     //   guard: { type: "transactionId" },
//       //     // },
//       //   ],
//       //   PREV: { target: "start" },
//       //   RESET: { target: "start" },
//       // },
//     },

//     // onboarding: onboardingMachine,
//     transactCrypto: {
//       on: {
//         CHAT_INPUT: [
//           {
//             guard: ({ event }) => greetings.includes(event.value),
//             target: "start",
//           },
//           {
//             guard: ({ event }) => greetings.includes(event.value),
//             target: "start",
//           },
//         ],
//       },
//     },
//     // transactCryptoMachine,
//     // payment: paymentMachine,
//     // banking: bankingMachine,
//     // support: supportMachine,
//     // reporting: reportingMachine,
//     // transaction: transactionMachine,
//   },
// });

// export const chatbotMachine = machineSetup.createMachine({
//   /** @xstate-layout N4IgpgJg5mDOIC5QGMAWBDALgIwPaYGVMwAHWAOlk3QCdMBiAYQAkBBAFQH0BJAOQAUAquwDaABgC6iUCVywAlpnm4AdtJAAPRAGZtAdjHkAbAE4AHGLMBWPUYAsARjF67AGhABPRA6tXt5E0DzMwAmOz0TKwcAX2j3NCw8QmIySmo6JjYuPiFRBykkEFkFJVV1LQRdA2NzSxt7Jxd3LwQHOxC9YyNu3yMIqzs7WPiMHHwiUgoqWgYWDh4BYREQgpk5RWU1QortZwdyNqsg0wGzZu8jMSMAhx6rMwM9PRthkASx5MnyZFUVMGRMAB1dAAGxBYFmWQWuXEqyK61KW1AOws-ieTgcDhCTm0VhC51ap3IjjuTnudhM2le7ySE1SPxUfwBwLBEMy8xyS3y6mKGzK2x0+kMpgs1lsjmcbk83isYn8FMCZkpkW0djEQzib1GtJSFDQuDkYFYAM27Oyi1Ekh5CM25R0ZlxAQ6IUuITxYmxBN05nI2iMuyMDm0tzMg2p2vGuu+qANsCNJtUZuhXLhvMRdsqqPI6LEmOxcrxXpCIS63SMViMIVx1ir4cSka++sNxsRSc5ohW1pKtoFmbl2b0GKxOML0oQgbspe6uhCZgspjrHzpepjzYTKjbFpE2lTNv5yPt-ZzeZH+LHIUCVmJc6u2iVob0i51jdXcZbprm5phdl33f3mkPNFB1zYcCzPFptFnTo7BvQNLj9EwYk1GkG3pV941bT9k1EKxfz5JEAL7ICh3zXFwIuFxswVB4+naCsrCfVCV1jDCPyhdsRCMPD017O8j2Ak8wIJIMrhuHpKz8KsHkYz5UkwGh0BUWB0ABRgaA8EhMFwTcYStQo0x7A8EBdfZ7l0bREJMUw1QcAkpMMPQ+MHXFy1zGTl3IeTFOU1T1M07SsI47l9L3AiKhM8gzO9BwrJMGy7LsYNyHsgwQjERCsXcqMvKUlTMDUjStJ0pZOxCv8wsQCKoosmLrNzOyjmuPY1TSrEjjCLKvhynz8r8orAq3Hcu3wjMqodaLYvisczH2W4yz6AwTBcexOrkhTct8wqAvYrcf2GnijLG8zLLq2zporA55uxGbHGeVapjAFQIAAcXkAAzSEOS3PS1nKjNnhMcgLDSkwwjvB47zs8sS2CK5HLVf0HXuyhHpe97Pq-FN9sMwiAaBj10rBudHLOc8DHlWDA0pMITGRmgwAARwAVzgTB+HQDwAFtHox7DYWx-8Kjx4HCcS4nIfPXx9lh0x-QGBxH2QiNZIoenmdZ9muZ54q8m4nGhaOfGQaJiHSZaF0PWvedQxvDpFZGesVc89bYDesAaAAWVUMAPB1-mypG3ssTsK8YoiMGnDldK7LB5KFXDy44Y1B2l2yl23c973fYGmFgt+wOjOD0OltBxLI92EwY8pKjAj0GasT6Mxke6jOvb+bOdphUr84Owii4OEuI7EKPK-PVVJxppbZbxOcjGb9P3bbn2-aGgPe4qfuw9L4Nh4ruyLMnFxa-uBWlVppXHY8lvF6zv29rX-XEGFgnt-Fs3Kp8fxdjEGw0scqm54X1Tl1Bemd25+1wgLCqCBn7GzFqbGOhtYaDkpLmKy89vKt1vjnJYXEoEZk3oPMuu9o7nkGFeSey0DBRGRqzeQnMsBGlgHGXmHEfrwj+kHJ41wIgKzxL4SCkE7I+CvIhbo4QHQmB-rQqg9DGGsGYWyHBut8FcNsNmRCzw3SSSEeeNK1wST2G6GIy4yctSXyjHQhhxAFEsL9t3DhBc+7cI0Xw7RgjyLGTdNcExIcBjtEHDIpQ1imF2OUduPWgtvAuN4VogRVZPFVmcMSOagwLJGDnLcZGfxMAAHdcA0AANZ+3YQZKJMDDYi1fggscbQpFTgrIMQYBgzEoSdjk-JRS-Z50cevJ+lSX4mxJsJeWl07gXgMDNbJEJOnFPCQ4sp0DYGi3BsM2plJJxzVco8PEuhpl5IKXMzuSxV490fhUwGVShkSxaDFUMU4KQVlzKqfZsy76RKWQMuBqybkf0thYH+jliyR3PinZ8qQOmHIgR8-6XyVlv2EoMQwWybBHAcNYcwQS5E2M5rgJmKhWHfRhb2Ysd4DhtG6DTGC6K9DCUHCWQxfhUWBAXEA8FFArHyNxfiwludiWHRcKZSkDpHKQSkaPW5GziSVjJLsKIkFkYJBoDAEp-LCLFh-gEckQYQ7BgpLS2ptgYZzTxO0MwlwXCKowMqsA3S1XhTSqI7Vqo-B1INbcma8oTVYhmtdK1tAVXzPtdE9RsT+E6MSWSFJ4j7z2Asv6m1K9g1eM1ZEUMOrXX6uEt0aWJrwhVjvP6WhBL3YACFFKFIIGAWgaBAQFIgKq1RhcYmaPDR44SbROjmUguWPwcqkJgqYuQHmZaK1VpragOtNAG3hJ6YsghLa3HxN0bc4MgNGUzV7QMBibKh0jpoOWlQlbq00FrfW+xyaFahtbe4hJwkXRmDEuWSkWI4qtOVh5OM4IASHqOV9XSyaNVOvTS6vVS1hIEwCEEZUNtzADvMcA1IX7-iYF-Xaptzjr1LojRBqyQNzJ22HtZQBg6nbIZ-RWi9GGHWpudbqt1HaYJjOfbPRGJGEPsuHSWmgxofg8t4EzTm2B3aNofuUjojhIrCv0DOcVBIp5Prgs4PQxZ7Ycb3dx3jeKCUCaEyJ2dgHBVSbvDJsVpDbkemgls9U8FzJ00ZizKgmtkC0Bnccy0hnJNHBM6Ki85nKq5kU1TFTEQ4r2fVk5jmLnp3obE9AiTQqfOyf8wgNJ0aejqnMFIndpGPLICZlQXA3MaAECZiQWQGRwmlNCqNIz3mRXJYlYgCk-gTH+ikW6ECiqCtaWK6V8rBTeVYzi7Vrz0nfNybHI5K8hjKzPCiFiEIGCNqIm4G5-9SxqucIFWNpLZmmvGQeIfPi9h823Bgstnqmw1uxbOeJur43Gt2VCBPE7FYYq+HfRYr49MKuYBBB3DbHnqOVQe3tvzB3gzdGzCd7ETxC32b+wD27vTzkJeMw1-bXpMTXHsv6SC4RnhUleCoXAEA4DqDacuEHCAAC0RgCT0-IMPFnrOWdtCW7usj6RMA071bjgRRrBwuFVNmys6WBgqd0Oa4nuWowMiZECUE4Jecjd4vYChsoFbosgtNkZTGTFSx-qGSkVqWLvn-PO3sjgyWCPSiFpUEREVugaRWfoYYudXxdnlAq-kaftC9HeK8fRegK3CJiHL6myOo1eh9Gn9wZsZIBniO2wYoZLUis5Wup8gzsap1GNWjm2Yc25gS+PfoDi4joi6XoTwGp4ZsG0AmbVS6Xawe3GnZJJxV9PrKZ4uYrAJUgk+26tULJN095Y2RITbEQk770ZKufIIVirLKbQVcJ7x3ri6OurzDnx+sNKmig48S3EcsIyTKVOt3ikXnj9U-glcu06ru78Xdm+iONTSs5qBHCSlVZfMPwH+IMTnOXF8ANMAGnR1R9O5YeCkE3T+YSCwfYP0HoW4N0RKC7SfL4fdX9cdU9SdetefMIbMWUSwboFTS4W4YSXYLtMsBPe3elZGcjVDCtKA4A30MWQta6I4QfWpDnOOIIVUPMOUL7RDDlTTZAPjHTQTYTGgKA90SKJwBUU-J4d1bwD0fYBUQIcfGCODcLIvZzVzBQ+4ZnFTRUN0XQHwdQ1LXQZnRlXQPofQUFKPPLHrIrd2frP7BQwYbMdFUMbERvBnKbF3dUOaXYRwSISIS7PKa7CABQ9RP0OwYxZIzETEOycwToQMAMRwawYMS1bA1IX7QbAHKAi1ZKS4WUQYEMOoIsCIYwESQMJUH+BHWIaIIAA */
//   id: "chatbotSteps",

//   initial: "start",

//   states: {
//     start: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "connectWallet",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "chooseAction",
//             guard: ({ event }) => event.value == "2",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },
//     connectWallet: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "chooseAction",
//             guard: ({ event }) => event.value == "connected",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },
//     chooseAction: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "transactCrypto",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "requestPaycard",
//             guard: ({ event }) => event.value == "2",
//           },
//           {
//             target: "customerSupport",
//             guard: ({ event }) => event.value == "3",
//           },
//           {
//             target: "transactionId",
//             guard: ({ event }) => event.value == "4",
//           },
//           {
//             target: "reportly",
//             guard: ({ event }) => event.value == "5",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => event.value == "0",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },
//     transactCrypto: {
//       on: {
//         CHAT_INPUT: [
//           {
//             // set transaction type globaly to transfer
//             target: "transferMoney",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             // this is for sending gift
//             // set transaction type globaly to gift
//             target: "transferMoney",
//             guard: ({ event }) => event.value == "2",
//           },
//           {
//             // set transaction type globaly to request
//             target: "requestPayment",
//             guard: ({ event }) => event.value == "3",
//           },
//           {
//             target: "chooseAction",
//             guard: ({ event }) => event.value == "0",
//           },
//           {
//             target: "start",
//             guard: ({ event }) =>
//               greetings.includes(event.value) || event.value == "0",
//           },
//         ],
//       },
//     },
//     sendGift: {
//       entry: "transferMoney",
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "transferMoney",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },
//     requestPayment: {
//       entry: "estimateAmount",
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "transferMoney",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },
//     transferMoney: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "estimateAsset",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "estimateAsset",
//             guard: ({ event }) => event.value == "2",
//           },
//           {
//             target: "estimateAsset",
//             guard: ({ event }) => event.value == "3",
//           },
//           {
//             target: "estimateAsset",
//             guard: ({ event }) => event.value == "4",
//           },
//           {
//             target: "network",
//             guard: ({ event }) => event.value == "5",
//           },
//           {
//             target: "transactCrypto",
//             guard: ({ event }) => event.value == "0",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },
//     estimateAsset: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "estimateAmount",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "estimateAmount",
//             guard: ({ event }) => event.value == "2",
//           },
//           {
//             target: "estimateAmount",
//             guard: ({ event }) => event.value == "3",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },
//     network: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "estimateAmount",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "estimateAmount",
//             guard: ({ event }) => event.value == "2",
//           },
//           {
//             target: "estimateAmount",
//             guard: ({ event }) => event.value == "3",
//           },
//           {
//             target: "estimateAmount",
//             guard: ({ event }) => event.value == "3",
//           },
//           {
//             target: "estimateAsset",
//             guard: ({ event }) => event.value == "0",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },

//     estimateAmount: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "charge",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },

//     charge: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "estimateAmount",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "estimateAmount",
//             guard: ({ event }) => event.value == "2",
//           },
//           {
//             target: "estimateAsset",
//             guard: ({ event }) => event.value == "0",
//           },
//           {
//             target: "start",
//             guard: ({ event }) =>
//               greetings.includes(event.value) || event.value == "00",
//           },
//         ],
//       },
//     },
//     enterBankSearchWord: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "selectBank",
//             guard: ({ event }) => {
//               let valid = event.value ? true : false;
//               return valid;
//             },
//           },

//           {
//             target: "charge",
//             guard: ({ event }) => event.value == "0",
//           },
//           {
//             target: "start",
//             guard: ({ event }) =>
//               greetings.includes(event.value) || event.value == "00",
//           },
//         ],
//       },
//     },
//     selectBank: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "enterAccountNumber",
//             guard: ({ event }) => event.value.length <= 2,
//           },
//           {
//             target: "enterBankSearchWord",
//             guard: ({ event }) => event.value == "0",
//           },
//           {
//             target: "start",
//             guard: ({ event }) =>
//               greetings.includes(event.value) || event.value == "0",
//           },
//         ],
//       },
//     },
//     enterAccountNumber: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "chooseAction",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },

//     requestPaycard: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "chooseAction",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },
//     customerSupport: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "chooseAction",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },
//     transactionId: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "chooseAction",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },
//     reportly: {
//       on: {
//         CHAT_INPUT: [
//           {
//             target: "chooseAction",
//             guard: ({ event }) => event.value == "1",
//           },
//           {
//             target: "start",
//             guard: ({ event }) => greetings.includes(event.value),
//           },
//         ],
//       },
//     },
//   },
// });
// let _actor: ReturnType<typeof createActor> | null = null;

// export function getStepService() {
//   if (!_actor) {
//     _actor = createActor(chatbotMachine).start();
//   }
//   return _actor;
// }
