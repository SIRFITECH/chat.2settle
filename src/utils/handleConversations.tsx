import { MessageType } from "../types/general_types";
import { greetings } from "./ChatbotConsts";
import * as genConvo from "./genConversationHandlers";
import * as cryptoTrxConvo from "./transactCryptoConversationHandlers";

export const handleConversation = async (
  chatInput: string,
  currentStep: string,
  walletIsConnected: boolean,
  wallet: `0x${string}` | undefined,
  formattedRate: string,
  telFirstName: string,
  setLoading: (loading: boolean) => void,
  addChatMessages: (messages: MessageType[]) => void,
  setChatInput: (input: string) => void,
  goToStep: (step: string) => void,
  nextStep: (step: string) => void,
  prevStep: () => void,
  setSharedPaymentMode: (mode: string) => void
) => {
  try {
    setLoading(true);
    if (chatInput.trim()) {
      const newMessage: MessageType = {
        type: "outgoing",
        content: <span>{chatInput}</span>,
        timestamp: new Date(),
      };
      addChatMessages([newMessage]);
    }

    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
    }

    switch (currentStep) {
      case "start":
        genConvo.helloMenu(
          addChatMessages,
          chatInput,
          walletIsConnected,
          wallet,
          telFirstName,
          setSharedPaymentMode,
          nextStep
        );
        break;
      case "chooseAction":
        console.log("current step is chooseAction");
        genConvo.choiceMenu(
          addChatMessages,
          chatInput,
          walletIsConnected,
          wallet,
          telFirstName,
          formattedRate,
          nextStep,
          prevStep,
          goToStep,
          setChatInput,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "transactCrypto":
        console.log("current step is transactCrypto");
        cryptoTrxConvo.handleMakeAChoice(
          addChatMessages,
          chatInput,
          walletIsConnected,
          wallet,
          telFirstName,
          nextStep,
          prevStep,
          goToStep,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      // case "transferMoney":
      //   console.log("Current step is transferMoney ");

      //   handleTransferMoney(chatInput);
      //   setChatInput("");
      //   break;

      // case "estimateAsset":
      //   console.log("Current step is estimateAsset ");

      //   handleEstimateAsset(chatInput);
      //   setChatInput("");
      //   break;

      // case "network":
      //   console.log("Current step is network ");

      //   handleNetwork(chatInput);
      //   setChatInput("");
      //   break;

      // case "payOptions":
      //   console.log("Current step is payOptions ");

      //   handlePayOptions(chatInput);
      //   setChatInput("");
      //   break;

      // case "charge":
      //   console.log("Current step is charge ");

      //   handleCharge(chatInput);
      //   setChatInput("");
      //   break;

      // case "enterBankSearchWord":
      //   console.log("Current step is enterBankSearchWord");
      //   let wantsToClaimGift =
      //     sharedPaymentMode.toLowerCase() === "claim gift";
      //   let wantsToSendGift = sharedPaymentMode.toLowerCase() === "gift";
      //   let wantsToRequestPayment =
      //     sharedPaymentMode.toLowerCase() === "request";
      //   let wnatsToTransactCrypto =
      //     sharedPaymentMode.toLowerCase() === "transfermoney";

      //   wantsToClaimGift || wnatsToTransactCrypto || wantsToRequestPayment
      //     ? (console.log("CURRENT STEP IS search IN enterBankSearchWord "),
      //       handleSearchBank(chatInput))
      //     : (console.log(
      //         "CURRENT STEP IS continueToPay IN enterBankSearchWord "
      //       ),
      //       handleContinueToPay(chatInput));
      //   setChatInput("");
      //   break;

      // case "selectBank":
      //   console.log("Current step is selectBank ");
      //   handleSelectBank(chatInput);
      //   setChatInput("");
      //   break;

      // case "enterAccountNumber":
      //   console.log("Current step is enterAccountNumber ");
      //   handleBankAccountNumber(chatInput);
      //   setChatInput("");
      //   break;

      // case "continueToPay":
      //   console.log("Current step is continueToPay ");

      //   handleContinueToPay(chatInput);
      //   setChatInput("");
      //   break;

      // case "enterPhone":
      //   console.log("Current step is enterPhone ");

      //   handlePhoneNumber(chatInput);
      //   setChatInput("");
      //   break;

      // case "sendPayment":
      //   console.log("Current step is sendPayment ");

      //   await handleCryptoPayment(chatInput);
      //   setChatInput("");
      //   break;

      // case "confirmTransaction":
      //   console.log("Current step is confirmTransaction ");

      //   handleConfirmTransaction(chatInput);
      //   setChatInput("");

      //   break;

      // case "paymentProcessing":
      //   console.log("Current step is paymentProcessing ");
      //   handleTransactionProcessing(chatInput);
      //   setChatInput("");
      //   break;

      // case "kycInfo":
      //   console.log("Current step is kycInfo ");
      //   handleKYCInfo(chatInput);
      //   setChatInput("");
      //   break;

      // case "kycReg":
      //   console.log("Current step is kycReg ");
      //   handleRegKYC(chatInput);
      //   setChatInput("");
      //   break;

      // case "thankForKYCReg":
      //   console.log("Current step is thankForKYCReg ");
      //   handleThankForKYCReg(chatInput);
      //   setChatInput("");
      //   break;

      // case "supportWelcome":
      //   console.log("Current step is supportWelcome ");
      //   displayCustomerSupportWelcome(addChatMessages, nextStep);
      //   setChatInput("");
      //   break;

      // case "assurance":
      //   console.log("Current step is assurance ");
      //   handleCustomerSupportAssurance(chatInput);
      //   setChatInput("");
      //   break;

      // case "entreTrxId":
      //   console.log("Current step is entreTrxId ");
      //   handleTransactionId(chatInput);
      //   setChatInput("");
      //   break;

      // case "makeComplain":
      //   console.log("Current step is makeComplain ");
      //   handleMakeComplain(chatInput);
      //   setChatInput("");
      //   break;

      // case "completeTransactionId":
      //   console.log("Current step is completeTransactionId ");
      //   handleCompleteTransactionId(chatInput);
      //   setChatInput("");
      //   break;

      // case "giftFeedBack":
      //   console.log("Current step is giftFeedBack ");
      //   handleGiftRequestId(chatInput);
      //   setChatInput("");
      //   break;

      // case "completetrxWithID":
      //   console.log("Current step is trxIDFeedback ");
      //   // handleReportlyWelcome(chatInput);
      //   setChatInput("");
      //   break;

      // case "makeReport":
      //   console.log("Current step is makeReport ");
      //   handleReportlyWelcome(chatInput);
      //   setChatInput("");
      //   break;

      // case "reporterName":
      //   console.log("Current step is reporterName ");
      //   handleReporterName(chatInput);
      //   setChatInput("");
      //   break;

      // case "reporterPhoneNumber":
      //   console.log("Current step is reporterPhoneNumber ");
      //   handleEnterReporterPhoneNumber(chatInput);
      //   setChatInput("");
      //   break;

      // case "reporterWallet":
      //   console.log("Current step is reporterWallet");
      //   handleEnterReporterWalletAddress(chatInput);
      //   setChatInput("");
      //   break;

      // case "fraudsterWallet":
      //   console.log("Current step is fraudsterWallet");
      //   handleEnterFraudsterWalletAddress(chatInput);
      //   setChatInput("");
      //   break;

      // case "reportlyNote":
      //   console.log("Current step is reportlyNote");
      //   handleReportlyNote(chatInput);
      //   setChatInput("");
      //   break;

      // case "reporterFarwell":
      //   console.log("Current step is reporterFarwell");
      //   handleReporterFarwell(chatInput);

      //   setChatInput("");
      //   break;

      default:
        addChatMessages([
          {
            type: "incoming",
            content: "Invalid choice, You can say 'Hi' or 'Hello' start over",
            timestamp: new Date(),
          },
        ]);
        break;
    }
  } catch (error) {
    addChatMessages([
      {
        type: "incoming",
        content:
          "I'm sorry, but an error occurred. Please try again or contact support if the problem persists.",
        timestamp: new Date(),
      },
    ]);
  } finally {
    setLoading(false);
    setChatInput("");
  }
};
