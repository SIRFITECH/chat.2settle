// import React from "react";
// import "@testing-library/jest-dom";
// import { choiceMenu, helloMenu } from "@/utils/genConversationHandlers";

// // Mock the ShortenedAddress component
// jest.mock("../src/components/ShortenAddress", () => ({
//   __esModule: true,
//   default: ({ wallet }: { wallet: string }) => (
//     <span data-testid="shortened-address">{wallet}</span>
//   ),
// }));

// // Mock the ConnectButton component
// jest.mock("@rainbow-me/rainbowkit", () => ({
//   ConnectButton: () => (
//     <button data-testid="connect-button">Connect Wallet</button>
//   ),
// }));

// describe("genConversationHandlers", () => {
//   const mockAddChatMessages = jest.fn();
//   const mockSetSharedPaymentMode = jest.fn();
//   const mockNextStep = jest.fn();
//   const mockPrevStep = jest.fn();
//   const mockGoToStep = jest.fn();
//   const mockSetChatInput = jest.fn();

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("helloMenu", () => {
//     it("should handle greeting with connected wallet", () => {
//       helloMenu(
//         mockAddChatMessages,
//         "hello",
//         true,
//         "0x1234567890abcdef",
//         "John",
//         mockSetSharedPaymentMode,
//         mockNextStep
//       );

//       expect(mockAddChatMessages).toHaveBeenCalledWith([
//         expect.objectContaining({
//           type: "incoming",
//           content: expect.anything(),
//         }),
//       ]);
//       expect(mockNextStep).toHaveBeenCalledWith("chooseAction");
//     });

//     it("should handle greeting without connected wallet", () => {
//       helloMenu(
//         mockAddChatMessages,
//         "hi",
//         false,
//         undefined,
//         "Jane",
//         mockSetSharedPaymentMode,
//         mockNextStep
//       );

//       expect(mockAddChatMessages).toHaveBeenCalledWith([
//         expect.objectContaining({
//           type: "incoming",
//           content: expect.anything(),
//         }),
//       ]);
//       expect(mockNextStep).toHaveBeenCalledWith("chooseAction");
//     });
//   });

//   describe("choiceMenu", () => {
//     it("should handle choice 1 with connected wallet", () => {
//       choiceMenu(
//         mockAddChatMessages,
//         "1",
//         true,
//         "0x1234567890abcdef",
//         "John",
//         "750 NGN",
//         mockNextStep,
//         mockPrevStep,
//         mockGoToStep,
//         mockSetChatInput,
//         mockSetSharedPaymentMode
//       );

//       expect(mockAddChatMessages).toHaveBeenCalledWith([
//         expect.objectContaining({
//           type: "incoming",
//           content: expect.anything(),
//           isComponent: true,
//           componentName: "ConnectButton",
//         }),
//         expect.objectContaining({
//           type: "incoming",
//           content: expect.anything(),
//         }),
//       ]);
//       expect(mockNextStep).toHaveBeenCalledWith("transactCrypto");
//     });

//     it("should handle choice 2 without connected wallet", () => {
//       choiceMenu(
//         mockAddChatMessages,
//         "2",
//         false,
//         undefined,
//         "Jane",
//         "750 NGN",
//         mockNextStep,
//         mockPrevStep,
//         mockGoToStep,
//         mockSetChatInput,
//         mockSetSharedPaymentMode
//       );

//       expect(mockAddChatMessages).toHaveBeenCalledWith([
//         expect.objectContaining({
//           type: "incoming",
//           content: expect.anything(),
//         }),
//         expect.objectContaining({
//           type: "incoming",
//           content: expect.anything(),
//         }),
//       ]);
//       expect(mockNextStep).toHaveBeenCalledWith("transactCrypto");
//     });

//     it("should handle invalid choice", () => {
//       choiceMenu(
//         mockAddChatMessages,
//         "invalid",
//         false,
//         undefined,
//         "Jane",
//         "750 NGN",
//         mockNextStep,
//         mockPrevStep,
//         mockGoToStep,
//         mockSetChatInput,
//         mockSetSharedPaymentMode
//       );

//       expect(mockAddChatMessages).toHaveBeenCalledWith([
//         expect.objectContaining({
//           type: "incoming",
//           content: expect.anything(),
//         }),
//       ]);
//     });
//   });
// });

import React from "react";
import "@testing-library/jest-dom";
import {
  helloMenu,
  welcomeMenu,
  choiceMenu,
} from "@/utils/genConversationHandlers";
import { greetings } from "@/utils/ChatbotConsts";

// Mock the ShortenedAddress component
jest.mock("../src/components/ShortenAddress", () => ({
  __esModule: true,
  default: ({ wallet }: { wallet: string }) => (
    <span data-testid="shortened-address">{wallet}</span>
  ),
}));

// Mock the ConnectButton component
jest.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: () => (
    <button data-testid="connect-button">Connect Wallet</button>
  ),
}));

describe("Conversation Handlers", () => {
  // Test helloMenu function
  describe("helloMenu", () => {
    it("should handle greeting when wallet is connected", () => {
      const addChatMessages = jest.fn();
      const setSharedPaymentMode = jest.fn();
      const nextStep = jest.fn();

      helloMenu(
        addChatMessages,
        "hi",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        setSharedPaymentMode,
        nextStep
      );

      expect(addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
          }),
        ])
      );
      expect(setSharedPaymentMode).toHaveBeenCalledWith("");
      expect(nextStep).toHaveBeenCalledWith("chooseAction");
    });

    it("should handle greeting when wallet is not connected", () => {
      const addChatMessages = jest.fn();
      const setSharedPaymentMode = jest.fn();
      const nextStep = jest.fn();

      helloMenu(
        addChatMessages,
        "hello",
        false,
        undefined,
        "John",
        setSharedPaymentMode,
        nextStep
      );

      expect(addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
          }),
        ])
      );
      expect(setSharedPaymentMode).toHaveBeenCalledWith("");
      expect(nextStep).toHaveBeenCalledWith("chooseAction");
    });

    it("should handle non-greeting input", () => {
      const addChatMessages = jest.fn();
      const setSharedPaymentMode = jest.fn();
      const nextStep = jest.fn();

      helloMenu(
        addChatMessages,
        "not a greeting",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        setSharedPaymentMode,
        nextStep
      );

      expect(addChatMessages).not.toHaveBeenCalled();
      expect(setSharedPaymentMode).not.toHaveBeenCalled();
      expect(nextStep).not.toHaveBeenCalled();
    });

    it("should handle empty input", () => {
      const addChatMessages = jest.fn();
      const setSharedPaymentMode = jest.fn();
      const nextStep = jest.fn();

      helloMenu(
        addChatMessages,
        "",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        setSharedPaymentMode,
        nextStep
      );

      expect(addChatMessages).not.toHaveBeenCalled();
      expect(setSharedPaymentMode).not.toHaveBeenCalled();
      expect(nextStep).not.toHaveBeenCalled();
    });
  });

  // Test welcomeMenu function
  describe("welcomeMenu", () => {
    it("should display welcome message when wallet is connected", () => {
      const addChatMessages = jest.fn();

      welcomeMenu(
        addChatMessages,
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "500 NGN"
      );

      expect(addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
          }),
        ])
      );
    });

    it("should display welcome message when wallet is not connected", () => {
      const addChatMessages = jest.fn();

      welcomeMenu(addChatMessages, false, undefined, "John", "500 NGN");

      expect(addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
          }),
        ])
      );
    });

    it("should handle empty wallet address when connected", () => {
      const addChatMessages = jest.fn();

      welcomeMenu(addChatMessages, true, undefined, "John", "500 NGN");

      expect(addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
          }),
        ])
      );
    });

    it("should handle empty name", () => {
      const addChatMessages = jest.fn();

      welcomeMenu(addChatMessages, false, undefined, "", "500 NGN");

      expect(addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
          }),
        ])
      );
    });
  });

  // Test choiceMenu function
  describe("choiceMenu", () => {
    const mockFunctions = {
      addChatMessages: jest.fn(),
      nextStep: jest.fn(),
      prevStep: jest.fn(),
      goToStep: jest.fn(),
      setChatInput: jest.fn(),
      setSharedPaymentMode: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should handle greeting input", () => {
      choiceMenu(
        mockFunctions.addChatMessages,
        "hi",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setChatInput,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.goToStep).toHaveBeenCalledWith("start");
    });

    it('should handle "0" input', () => {
      choiceMenu(
        mockFunctions.addChatMessages,
        "0",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setChatInput,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.prevStep).toHaveBeenCalled();
    });

    it('should handle "1" input when wallet is not connected', () => {
      choiceMenu(
        mockFunctions.addChatMessages,
        "1",
        false,
        undefined,
        "John",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setChatInput,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
            isComponent: true,
            componentName: "ConnectButton",
          }),
        ])
      );
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("transactCrypto");
    });

    it('should handle "1" input when wallet is connected', () => {
      choiceMenu(
        mockFunctions.addChatMessages,
        "1",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setChatInput,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
            isComponent: true,
            componentName: "ConnectButton",
          }),
        ])
      );
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("transactCrypto");
    });

    it('should handle "2" input when wallet is not connected', () => {
      choiceMenu(
        mockFunctions.addChatMessages,
        "2",
        false,
        undefined,
        "John",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setChatInput,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
          }),
        ])
      );
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("transactCrypto");
    });

    it('should handle "2" input when wallet is connected', () => {
      choiceMenu(
        mockFunctions.addChatMessages,
        "2",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setChatInput,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
          }),
        ])
      );
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("transactCrypto");
    });

    it("should handle invalid input", () => {
      choiceMenu(
        mockFunctions.addChatMessages,
        "invalid",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setChatInput,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
          }),
        ])
      );
    });

    it("should handle empty input", () => {
      const mockFunctions = {
        addChatMessages: jest.fn(),
        nextStep: jest.fn(),
        prevStep: jest.fn(),
        goToStep: jest.fn(),
        setChatInput: jest.fn(),
        setSharedPaymentMode: jest.fn(),
      };

      choiceMenu(
        mockFunctions.addChatMessages,
        "",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setChatInput,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
          }),
        ])
      );
    });

    it("should handle input with leading/trailing spaces", () => {
      const mockFunctions = {
        addChatMessages: jest.fn(),
        nextStep: jest.fn(),
        prevStep: jest.fn(),
        goToStep: jest.fn(),
        setChatInput: jest.fn(),
        setSharedPaymentMode: jest.fn(),
      };

      choiceMenu(
        mockFunctions.addChatMessages,
        "  1  ",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setChatInput,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: "incoming",
            content: expect.anything(),
            isComponent: true,
            componentName: "ConnectButton",
          }),
        ])
      );
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("transactCrypto");
    });

    it("should handle case-insensitive greetings", () => {
      const mockFunctions = {
        addChatMessages: jest.fn(),
        nextStep: jest.fn(),
        prevStep: jest.fn(),
        goToStep: jest.fn(),
        setChatInput: jest.fn(),
        setSharedPaymentMode: jest.fn(),
      };

      greetings.forEach((greeting: string) => {
        choiceMenu(
          mockFunctions.addChatMessages,
          greeting.toUpperCase(),
          true,
          "0x1234567890123456789012345678901234567890",
          "John",
          "500 NGN",
          mockFunctions.nextStep,
          mockFunctions.prevStep,
          mockFunctions.goToStep,
          mockFunctions.setChatInput,
          mockFunctions.setSharedPaymentMode
        );

        expect(mockFunctions.goToStep).toHaveBeenCalledWith("start");
      });
    });
  });
});
