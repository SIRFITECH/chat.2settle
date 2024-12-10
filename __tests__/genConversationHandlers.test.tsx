import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { choiceMenu, helloMenu } from "@/utils/genConversationHandlers";

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

describe("genConversationHandlers", () => {
  const mockAddChatMessages = jest.fn();
  const mockSetSharedPaymentMode = jest.fn();
  const mockNextStep = jest.fn();
  const mockPrevStep = jest.fn();
  const mockGoToStep = jest.fn();
  const mockSetChatInput = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("helloMenu", () => {
    it("should handle greeting with connected wallet", () => {
      helloMenu(
        mockAddChatMessages,
        "hello",
        true,
        "0x1234567890abcdef",
        "John",
        mockSetSharedPaymentMode,
        mockNextStep
      );

      expect(mockAddChatMessages).toHaveBeenCalledWith([
        expect.objectContaining({
          type: "incoming",
          content: expect.anything(),
        }),
      ]);
      expect(mockNextStep).toHaveBeenCalledWith("chooseAction");
    });

    it("should handle greeting without connected wallet", () => {
      helloMenu(
        mockAddChatMessages,
        "hi",
        false,
        undefined,
        "Jane",
        mockSetSharedPaymentMode,
        mockNextStep
      );

      expect(mockAddChatMessages).toHaveBeenCalledWith([
        expect.objectContaining({
          type: "incoming",
          content: expect.anything(),
        }),
      ]);
      expect(mockNextStep).toHaveBeenCalledWith("chooseAction");
    });
  });

  describe("choiceMenu", () => {
    it("should handle choice 1 with connected wallet", () => {
      choiceMenu(
        mockAddChatMessages,
        "1",
        true,
        "0x1234567890abcdef",
        "John",
        "750 NGN",
        mockNextStep,
        mockPrevStep,
        mockGoToStep,
        mockSetChatInput,
        mockSetSharedPaymentMode
      );

      expect(mockAddChatMessages).toHaveBeenCalledWith([
        expect.objectContaining({
          type: "incoming",
          content: expect.anything(),
          isComponent: true,
          componentName: "ConnectButton",
        }),
        expect.objectContaining({
          type: "incoming",
          content: expect.anything(),
        }),
      ]);
      expect(mockNextStep).toHaveBeenCalledWith("transactCrypto");
    });

    it("should handle choice 2 without connected wallet", () => {
      choiceMenu(
        mockAddChatMessages,
        "2",
        false,
        undefined,
        "Jane",
        "750 NGN",
        mockNextStep,
        mockPrevStep,
        mockGoToStep,
        mockSetChatInput,
        mockSetSharedPaymentMode
      );

      expect(mockAddChatMessages).toHaveBeenCalledWith([
        expect.objectContaining({
          type: "incoming",
          content: expect.anything(),
        }),
        expect.objectContaining({
          type: "incoming",
          content: expect.anything(),
        }),
      ]);
      expect(mockNextStep).toHaveBeenCalledWith("transactCrypto");
    });

    it("should handle invalid choice", () => {
      choiceMenu(
        mockAddChatMessages,
        "invalid",
        false,
        undefined,
        "Jane",
        "750 NGN",
        mockNextStep,
        mockPrevStep,
        mockGoToStep,
        mockSetChatInput,
        mockSetSharedPaymentMode
      );

      expect(mockAddChatMessages).toHaveBeenCalledWith([
        expect.objectContaining({
          type: "incoming",
          content: expect.anything(),
        }),
      ]);
    });
  });
});
