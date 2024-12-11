import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  handleMakeAChoice,
  handleTransferMoney,
  handleEstimateAsset,
} from "@/utils/transactCryptoConversationHandlers";
import * as transactCryptoMenus from "@/menus/transact_crypto";
import * as requestPaycardMenus from "@/menus/request_paycard";
import * as customerSupportMenus from "@/menus/customer_support";
import * as reportlyMenus from "@/menus/reportly";
import * as transactionIdMenus from "@/menus/transaction_id";
import * as genConversationHandlers from "@/utils/genConversationHandlers";

// Mock all imported functions /Users/isirfitech/Projects/MainProjects/chat.2settle/src/menus/transact_crypto.tsx
jest.mock("../src/menus/transact_crypto");
jest.mock("../src/menus/request_paycard");
jest.mock("../src/menus/customer_support");
jest.mock("../src/menus/reportly");
jest.mock("../src/menus/transaction_id");
jest.mock("../src/utils/genConversationHandlers");

describe("Crypto Transaction Conversation Handlers", () => {
  const mockFunctions = {
    addChatMessages: jest.fn(),
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    goToStep: jest.fn(),
    setSharedPaymentMode: jest.fn(),
    setSharedWallet: jest.fn(),
    setSharedEstimateAsset: jest.fn(),
    setSharedTicker: jest.fn(),
    setSharedCrypto: jest.fn(),
    setSharedNetwork: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleMakeAChoice", () => {
    it("should handle greeting input", () => {
      handleMakeAChoice(
        mockFunctions.addChatMessages,
        "hi",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.goToStep).toHaveBeenCalledWith("start");
      expect(genConversationHandlers.helloMenu).toHaveBeenCalled();
    });

    it('should handle "00" input', () => {
      handleMakeAChoice(
        mockFunctions.addChatMessages,
        "00",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.goToStep).toHaveBeenCalledWith("start");
      expect(genConversationHandlers.helloMenu).toHaveBeenCalled();
    });

    it('should handle "0" input', () => {
      handleMakeAChoice(
        mockFunctions.addChatMessages,
        "0",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.prevStep).toHaveBeenCalled();
      expect(genConversationHandlers.helloMenu).toHaveBeenCalled();
    });

    it('should handle "1" input (Transact Crypto)', () => {
      handleMakeAChoice(
        mockFunctions.addChatMessages,
        "1",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode
      );

      expect(transactCryptoMenus.displayTransactCrypto).toHaveBeenCalled();
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("transferMoney");
    });

    it('should handle "2" input (Request Pay Card)', () => {
      handleMakeAChoice(
        mockFunctions.addChatMessages,
        "2",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode
      );

      expect(requestPaycardMenus.displayKYCInfo).toHaveBeenCalled();
    });

    it('should handle "3" input (Customer Support)', () => {
      handleMakeAChoice(
        mockFunctions.addChatMessages,
        "3",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode
      );

      expect(
        customerSupportMenus.displayCustomerSupportWelcome
      ).toHaveBeenCalled();
    });

    it('should handle "4" input (Transaction ID)', () => {
      handleMakeAChoice(
        mockFunctions.addChatMessages,
        "4",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode
      );

      expect(transactionIdMenus.displayTransactIDWelcome).toHaveBeenCalled();
    });

    it('should handle "5" input (Reportly)', () => {
      handleMakeAChoice(
        mockFunctions.addChatMessages,
        "5",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode
      );

      expect(reportlyMenus.displayReportlyWelcome).toHaveBeenCalled();
    });

    it("should handle invalid input", () => {
      handleMakeAChoice(
        mockFunctions.addChatMessages,
        "invalid",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalledWith([
        expect.objectContaining({
          type: "incoming",
          content:
            "Invalid choice. You need to choose an action from the options",
        }),
      ]);
    });
  });

  describe("handleTransferMoney", () => {
    it("should handle greeting input", () => {
      handleTransferMoney(
        mockFunctions.addChatMessages,
        "hi",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedWallet,
        mockFunctions.setSharedEstimateAsset
      );

      expect(mockFunctions.goToStep).toHaveBeenCalledWith("start");
      expect(genConversationHandlers.helloMenu).toHaveBeenCalled();
    });

    it('should handle "0" input', () => {
      handleTransferMoney(
        mockFunctions.addChatMessages,
        "0",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedWallet,
        mockFunctions.setSharedEstimateAsset
      );

      expect(mockFunctions.prevStep).toHaveBeenCalled();
      expect(genConversationHandlers.welcomeMenu).toHaveBeenCalled();
    });

    it('should handle "1" input (Transfer Money)', () => {
      handleTransferMoney(
        mockFunctions.addChatMessages,
        "1",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedWallet,
        mockFunctions.setSharedEstimateAsset
      );

      expect(mockFunctions.setSharedPaymentMode).toHaveBeenCalledWith(
        "transferMoney"
      );
      expect(transactCryptoMenus.displayTransferMoney).toHaveBeenCalled();
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("estimateAsset");
    });

    it('should handle "2" input (Send Gift)', () => {
      handleTransferMoney(
        mockFunctions.addChatMessages,
        "2",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedWallet,
        mockFunctions.setSharedEstimateAsset
      );

      expect(transactCryptoMenus.displayTransferMoney).toHaveBeenCalled();
      expect(mockFunctions.setSharedPaymentMode).toHaveBeenCalledWith("Gift");
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("estimateAsset");
    });

    it('should handle "3" input (Request for payment)', () => {
      handleTransferMoney(
        mockFunctions.addChatMessages,
        "3",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedWallet,
        mockFunctions.setSharedEstimateAsset
      );

      expect(transactCryptoMenus.displayPayIn).toHaveBeenCalled();
      expect(mockFunctions.setSharedEstimateAsset).toHaveBeenCalledWith(
        "Naira"
      );
      expect(mockFunctions.nextStep).toHaveBeenCalledWith(
        "enterBankSearchWord"
      );
      expect(mockFunctions.setSharedPaymentMode).toHaveBeenCalledWith(
        "request"
      );
    });

    it("should handle invalid input", () => {
      handleTransferMoney(
        mockFunctions.addChatMessages,
        "invalid",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        "500 NGN",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedWallet,
        mockFunctions.setSharedEstimateAsset
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalledWith([
        expect.objectContaining({
          type: "incoming",
          content: "Invalid choice. Say 'Hi' or 'Hello' to start over",
        }),
      ]);
    });
  });

  describe("handleEstimateAsset", () => {
    it("should handle greeting input", async () => {
      await handleEstimateAsset(
        mockFunctions.addChatMessages,
        "hi",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedTicker,
        mockFunctions.setSharedCrypto,
        mockFunctions.setSharedNetwork
      );

      expect(mockFunctions.goToStep).toHaveBeenCalledWith("start");
      expect(genConversationHandlers.helloMenu).toHaveBeenCalled();
    });

    it('should handle "0" input', async () => {
      await handleEstimateAsset(
        mockFunctions.addChatMessages,
        "0",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedTicker,
        mockFunctions.setSharedCrypto,
        mockFunctions.setSharedNetwork
      );

      expect(mockFunctions.prevStep).toHaveBeenCalled();
      expect(mockFunctions.addChatMessages).toHaveBeenCalled();
    });

    it('should handle "00" input', async () => {
      await handleEstimateAsset(
        mockFunctions.addChatMessages,
        "00",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedTicker,
        mockFunctions.setSharedCrypto,
        mockFunctions.setSharedNetwork
      );

      expect(mockFunctions.goToStep).toHaveBeenCalledWith("chooseAction");
      expect(genConversationHandlers.helloMenu).toHaveBeenCalled();
    });

    it('should handle "1" input (Bitcoin)', async () => {
      await handleEstimateAsset(
        mockFunctions.addChatMessages,
        "1",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedTicker,
        mockFunctions.setSharedCrypto,
        mockFunctions.setSharedNetwork
      );

      expect(transactCryptoMenus.displayHowToEstimation).toHaveBeenCalledWith(
        mockFunctions.addChatMessages,
        "Bitcoin (BTC)",
        "transferMoney"
      );
      expect(mockFunctions.setSharedTicker).toHaveBeenCalledWith("BTCUSDT");
      expect(mockFunctions.setSharedCrypto).toHaveBeenCalledWith("BTC");
      expect(mockFunctions.setSharedNetwork).toHaveBeenCalledWith("BTC");
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("payOptions");
    });

    it('should handle "2" input (Ethereum)', async () => {
      await handleEstimateAsset(
        mockFunctions.addChatMessages,
        "2",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedTicker,
        mockFunctions.setSharedCrypto,
        mockFunctions.setSharedNetwork
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalled();
      expect(mockFunctions.setSharedTicker).toHaveBeenCalledWith("ETHUSDT");
      expect(mockFunctions.setSharedCrypto).toHaveBeenCalledWith("ETH");
      expect(mockFunctions.setSharedNetwork).toHaveBeenCalledWith("ERC20");
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("payOptions");
    });

    it('should handle "3" input (Binance)', async () => {
      await handleEstimateAsset(
        mockFunctions.addChatMessages,
        "3",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedTicker,
        mockFunctions.setSharedCrypto,
        mockFunctions.setSharedNetwork
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalled();
      expect(mockFunctions.setSharedTicker).toHaveBeenCalledWith("BNBUSDT");
      expect(mockFunctions.setSharedCrypto).toHaveBeenCalledWith("BNB");
      expect(mockFunctions.setSharedNetwork).toHaveBeenCalledWith("BEP20");
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("payOptions");
    });

    it('should handle "4" input (Tron)', async () => {
      await handleEstimateAsset(
        mockFunctions.addChatMessages,
        "4",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedTicker,
        mockFunctions.setSharedCrypto,
        mockFunctions.setSharedNetwork
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalled();
      expect(mockFunctions.setSharedTicker).toHaveBeenCalledWith("TRXUSDT");
      expect(mockFunctions.setSharedCrypto).toHaveBeenCalledWith("TRX");
      expect(mockFunctions.setSharedNetwork).toHaveBeenCalledWith("TRC20");
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("payOptions");
    });

    it('should handle "5" input (USDT)', async () => {
      await handleEstimateAsset(
        mockFunctions.addChatMessages,
        "5",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedTicker,
        mockFunctions.setSharedCrypto,
        mockFunctions.setSharedNetwork
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalled();
      expect(mockFunctions.setSharedTicker).toHaveBeenCalledWith("USDT");
      expect(mockFunctions.setSharedCrypto).toHaveBeenCalledWith("USDT");
      expect(mockFunctions.nextStep).toHaveBeenCalledWith("network");
    });

    it("should handle invalid input", async () => {
      await handleEstimateAsset(
        mockFunctions.addChatMessages,
        "invalid",
        true,
        "0x1234567890123456789012345678901234567890",
        "John",
        "transferMoney",
        mockFunctions.nextStep,
        mockFunctions.prevStep,
        mockFunctions.goToStep,
        mockFunctions.setSharedPaymentMode,
        mockFunctions.setSharedTicker,
        mockFunctions.setSharedCrypto,
        mockFunctions.setSharedNetwork
      );

      expect(mockFunctions.addChatMessages).toHaveBeenCalledWith([
        expect.objectContaining({
          type: "incoming",
          content: "Invalid choice. Choose a valid estimate asset",
        }),
      ]);
    });
  });
});
