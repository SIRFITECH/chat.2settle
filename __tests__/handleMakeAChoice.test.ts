
// import { handleMakeAChoice } from "../src/components/ChatBot";

// // Mock the dependencies
// jest.mock("../src/components/ChatBot", () => ({
//   goToStep: jest.fn(),
//   helloMenu: jest.fn(),
//   prevStep: jest.fn(),
// }));
// jest.mock("@/menus/transact_crypto", () => ({
//   displayTransactCrypto: jest.fn(),
//   displayKYCInfo: jest.fn(),
//   displayCustomerSupportWelcome: jest.fn(),
//   displayTransactIDWelcome: jest.fn(),
//   displayReportlyWelcome: jest.fn(),
// }));

// // Import the mocked dependencies
// import { goToStep, helloMenu, prevStep } from "../src/components/ChatBot";
// import {
//   displayTransactCrypto,
//   displayKYCInfo,
//   displayCustomerSupportWelcome,
//   displayTransactIDWelcome,
//   displayReportlyWelcome,
// } from "@/menus/transact_crypto";

// describe('handleMakeAChoice', () => {
//   let addChatMessages: jest.Mock;
//   let nextStep: jest.Mock;

//   beforeEach(() => {
//     addChatMessages = jest.fn();
//     nextStep = jest.fn();
//     jest.clearAllMocks();
//   });

//   test('handles greeting input', () => {
//     handleMakeAChoice('hello');
//     expect(goToStep).toHaveBeenCalledWith('start');
//     expect(helloMenu).toHaveBeenCalledWith('hello');
//   });

//   test('handles input "0" (first condition)', () => {
//     handleMakeAChoice('0');
//     expect(goToStep).toHaveBeenCalledWith('start');
//     expect(helloMenu).toHaveBeenCalledWith('hi');
//   });

//   test('handles input "0" (second condition)', () => {
//     handleMakeAChoice('0');
//     expect(prevStep).toHaveBeenCalled();
//     expect(helloMenu).toHaveBeenCalledWith('hi');
//   });

//   test('handles input "1"', () => {
//     handleMakeAChoice('1');
//     expect(displayTransactCrypto).toHaveBeenCalledWith(addChatMessages);
//     expect(nextStep).toHaveBeenCalledWith('transferMoney');
//   });

//   test('handles input "2"', () => {
//     handleMakeAChoice('2');
//     expect(displayKYCInfo).toHaveBeenCalledWith(addChatMessages, nextStep);
//   });

//   test('handles input "3"', () => {
//     handleMakeAChoice('3');
//     expect(displayCustomerSupportWelcome).toHaveBeenCalledWith(addChatMessages, nextStep);
//   });

//   test('handles input "4"', () => {
//     handleMakeAChoice('4');
//     expect(displayTransactIDWelcome).toHaveBeenCalledWith(addChatMessages, nextStep);
//   });

//   test('handles input "5"', () => {
//     handleMakeAChoice('5');
//     expect(displayReportlyWelcome).toHaveBeenCalledWith(addChatMessages, nextStep);
//   });

//   test('handles invalid input', () => {
//     handleMakeAChoice('invalid');
//     expect(addChatMessages).toHaveBeenCalledWith([
//       {
//         type: 'incoming',
//         content: 'Invalid choice. You need to choose an action from the options',
//       },
//     ]);
//   });
// });
