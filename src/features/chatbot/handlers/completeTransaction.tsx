/**
 * handle gift flow
 */

import { checkGiftExists, checkRequestExists } from "@/helpers/api_calls";
import { displayTransferMoney } from "@/menus/transact_crypto";
import {
  displayTransactIDWelcome,
  displayGiftFeedbackMessage,
  displayEnterCompleteTransactionId,
  displayEnterId,
} from "@/menus/transaction_id";
import { greetings } from "../helpers/ChatbotConsts";
import { choiceMenu, helloMenu } from "./general";
import { MessageType } from "@/types/general_types";
import { WalletAddress } from "@/lib/wallets/types";
import { StepId } from "@/core/machines/steps";

// ALLOW USERS ENTER GIFT ID
export const handleGiftRequestId = async (
  addChatMessages: (messages: MessageType[]) => void,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  sharedPaymentMode: string,
  chatInput: string,
  nextStep: () => void,
  goToStep: (step: StepId) => void,
  prevStep: () => void,
  setSharedPaymentMode: (mode: string) => void,
  setSharedGiftId: (giftId: string) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    goToStep("start");
    helloMenu(
      addChatMessages,
      chatInput,
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
  } else if (chatInput.trim() === "00") {
    (() => {
      goToStep("start");
      // helloMenu("hi");
      helloMenu(
        addChatMessages,
        "hi",
        nextStep,
        walletIsConnected,
        wallet,
        telFirstName,
        setSharedPaymentMode
      );
    })();
  } else if (chatInput.trim() === "0") {
    (() => {
      prevStep();
      displayTransactIDWelcome(addChatMessages, nextStep);
    })();
  } else if (chatInput !== "0") {
    const needed_id = chatInput.trim();
    setLoading(true);
    setSharedGiftId(chatInput.trim());

    try {
      let giftExists = false;
      let requestExists = false;

      // Check if it's a gift or request
      if (sharedPaymentMode === "Claim Gift") {
        giftExists = (await checkGiftExists(needed_id)).exists;
      } else {
        requestExists = (await checkRequestExists(needed_id)).exists;
      }

      const idExists = giftExists || requestExists;

      console.log("gift is processing");

      // IF GIFT_ID EXIST IN DB,
      if (idExists) {
        if (giftExists) {
          // Handle gift exists case
          displayGiftFeedbackMessage(addChatMessages, nextStep);
          helloMenu(
            addChatMessages,
            "hi",
            nextStep,
            walletIsConnected,
            wallet,
            telFirstName,
            setSharedPaymentMode
          );
        } else if (requestExists) {
          // Handle request exists case
          // displayRequestFeedbackMessage(addChatMessages, nextStep);
          displayTransferMoney(addChatMessages);
          nextStep();
          // nextStep("estimateAsset");
        }
      } else {
        addChatMessages([
          {
            type: "incoming",
            content: `Invalid ${
              sharedPaymentMode === "Claim Gift" ? "gift" : "request"
            }_id. Try again`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      addChatMessages([
        {
          type: "incoming",
          content: "Error checking ID. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }
};

// Allow user to enter transaction id to complete transaction
export const handleCompleteTransactionId = async (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  formattedRate: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  nextStep: () => void,
  goToStep: (step: StepId) => void,
  prevStep: () => void,
  setSharedPaymentMode: (mode: string) => void
) => {
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    goToStep("start");
    helloMenu(
      addChatMessages,
      chatInput,
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
  } else if (chatInput.trim() === "0") {
    (() => {
      prevStep();
      choiceMenu(
        addChatMessages,
        "2",
        walletIsConnected,
        wallet,
        telFirstName,
        formattedRate,
        nextStep,
        prevStep,
        goToStep,
        setSharedPaymentMode
      );
    })();
  } else if (chatInput === "1") {
    displayEnterCompleteTransactionId(addChatMessages, nextStep);
  } else if (chatInput === "2") {
    console.log("Let's see what is going on HERE!!!");
    displayEnterId(addChatMessages, nextStep, "Claim Gift");
    setSharedPaymentMode("Claim Gift");
  } else if (chatInput === "3") {
    displayEnterId(addChatMessages, nextStep, "payRequest");
    setSharedPaymentMode("payRequest");
  }
};
