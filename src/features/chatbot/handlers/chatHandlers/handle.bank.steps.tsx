import useChatStore from "stores/chatStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displayPayIn } from "./menus/display.payment.options";
import {
  displayEnterAccountNumber,
  displaySearchBank,
  displaySelectBank,
} from "./menus/display.bank.search";
import { fetchBankNames } from "@/services/bank/bank.service";
import { useBankStore } from "stores/bankStore";
import { displayCharge } from "./menus/display.charge";

// GET USER BANK DETAILS FROM NUBAN
export const handleSearchBank = async (chatInput: string) => {
  const { next, prev, addMessages } = useChatStore.getState();
  // IS USER TRYING TO CLAIM GIFT?
  //   let wantsToClaimGift =
  //     sharedPaymentMode.toLowerCase().trim() === "claim gift";
  //   let wantsToSendGift = sharedPaymentMode.toLowerCase().trim() === "gift";
  //   let wantsToRequestPayment =
  //     sharedPaymentMode.toLowerCase().trim() === "request";

  //   if (wantsToClaimGift) {
  //     console.log("USER WANTS TO CLAIM GIFT");
  //     if (greetings.includes(chatInput.trim().toLowerCase())) {
  //       goToStep("start");
  //       helloMenu(
  //         addChatMessages,
  //         chatInput,
  //         nextStep,
  //         walletIsConnected,
  //         wallet,
  //         telFirstName,
  //         setSharedPaymentMode
  //       );
  //     } else if (chatInput.trim() === "00") {
  //       (() => {
  //         goToStep("start");
  //         helloMenu(
  //           addChatMessages,
  //           "hi",
  //           nextStep,
  //           walletIsConnected,
  //           wallet,
  //           telFirstName,
  //           setSharedPaymentMode
  //         );
  //       })();
  //     } else if (chatInput.trim() === "0") {
  //       (() => {
  //         prevStep();
  //         displayTransactIDWelcome(addChatMessages, nextStep);
  //       })();
  //     } else if (chatInput !== "0") {
  //       const gift_id = chatInput.trim();
  //       setLoading(true);
  //       setSharedGiftId(gift_id);
  //       let giftExists = (await checkGiftExists(gift_id)).exists;
  //       console.log("Gift is", giftExists);
  //       setLoading(false);
  //       // IF GIFT_ID EXIST IN DB,
  //       if (giftExists) {
  //         displaySearchBank(addChatMessages, nextStep);
  //       } else {
  //         addChatMessages([
  //           {
  //             type: "incoming",
  //             content: "Invalid gift_id. Try again",
  //             timestamp: new Date(),
  //           },
  //         ]);
  //       }
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
  //   } else if (wantsToSendGift) {
  //     console.log("USER WANTS TO SEND GIFT");
  //     const chargeFixed = parseFloat(sharedCharge);
  //     if (greetings.includes(chatInput.trim().toLowerCase())) {
  //       goToStep("start");
  //       helloMenu(
  //         addChatMessages,
  //         chatInput,
  //         nextStep,
  //         walletIsConnected,
  //         wallet,
  //         telFirstName,
  //         setSharedPaymentMode
  //       );
  //     } else if (chatInput === "00") {
  //       (() => {
  //         goToStep("start");
  //         helloMenu(
  //           addChatMessages,
  //           "hi",
  //           nextStep,
  //           walletIsConnected,
  //           wallet,
  //           telFirstName,
  //           setSharedPaymentMode
  //         );
  //       })();
  //     } else if (chatInput === "0") {
  //       (() => {
  //         prevStep();
  //         displayPayIn(
  //           addChatMessages,
  //           sharedEstimateAsset,
  //           sharedRate,
  //           sharedCrypto,
  //           sharedAssetPrice,
  //           sharedCrypto
  //         );
  //       })();
  //     } else if (chatInput === "1") {
  //       const finalAssetPayment = parseFloat(sharedPaymentAssetEstimate);
  //       const finalNairaPayment =
  //         parseFloat(sharedPaymentNairaEstimate) - parseFloat(sharedNairaCharge);

  //       setSharedPaymentAssetEstimate(finalAssetPayment.toString());
  //       setSharedPaymentNairaEstimate(finalNairaPayment.toString());
  //       setSharedChargeForDB(
  //         `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
  //       ),
  //         displaySearchBank(addChatMessages, nextStep);
  //     } else if (chatInput === "2") {
  //       const finalAssetPayment =
  //         parseFloat(sharedPaymentAssetEstimate) + parseFloat(sharedCharge);
  //       const finalNairaPayment = parseFloat(sharedPaymentNairaEstimate);

  //       setSharedPaymentAssetEstimate(finalAssetPayment.toString());
  //       setSharedPaymentNairaEstimate(finalNairaPayment.toString());
  //       setSharedChargeForDB(
  //         `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
  //       );
  //       displaySearchBank(addChatMessages, nextStep);
  //     } else {
  //       addChatMessages([
  //         {
  //           type: "incoming",
  //           content:
  //             "Invalid choice. Please choose with the options or say 'Hi' to start over.",
  //           timestamp: new Date(),
  //         },
  //       ]);
  //     }
  //   } else if (wantsToRequestPayment) {
  //     console.log("USER WANTS TO REQUEST PAYMENT");
  //     if (greetings.includes(chatInput.trim().toLowerCase())) {
  //       goToStep("start");
  //       helloMenu(
  //         addChatMessages,
  //         chatInput,
  //         nextStep,
  //         walletIsConnected,
  //         wallet,
  //         telFirstName,
  //         setSharedPaymentMode
  //       );
  //     } else if (chatInput === "00") {
  //       (() => {
  //         goToStep("start");
  //         helloMenu(
  //           addChatMessages,
  //           "hi",
  //           nextStep,
  //           walletIsConnected,
  //           wallet,
  //           telFirstName,
  //           setSharedPaymentMode
  //         );
  //       })();
  //     } else if (chatInput === "0") {
  //       (() => {
  //         prevStep();
  //         displayPayIn(
  //           addChatMessages,
  //           sharedEstimateAsset,
  //           sharedRate,
  //           sharedCrypto,
  //           sharedAssetPrice,
  //           sharedCrypto
  //         );
  //       })();
  //     } else {
  //       // chatInput.trim()
  //       // CLEAN THE STRING HERE
  //       chatInput = chatInput.replace(/[^0-9.]/g, "");
  //       if (Number(chatInput) > 20000 && Number(chatInput) < 2000000) {
  //         setSharedPaymentNairaEstimate(chatInput);
  //         displaySearchBank(addChatMessages, nextStep);
  //       } else {
  //         addChatMessages([
  //           {
  //             type: "incoming",
  //             content: (
  //               <span>
  //                 You can only recieve <br />
  //                 <b>Min: {formatCurrency("20000", "NGN", "en-NG")}</b> and <br />
  //                 <b>Max: {formatCurrency("2000000", "NGN", "en-NG")}</b>
  //               </span>
  //             ),
  //             timestamp: new Date(),
  //           },
  //         ]);
  //       }
  //     }
  //   } else {
  console.log("USER WANTS TO TRANSACT CRYPTO");
  // const chargeFixed = parseFloat(sharedCharge);
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      helloMenu("hi");
    })();
  } else if (chatInput === "0") {
    (() => {
      prev();
      displayPayIn();
    })();
  } else if (chatInput === "1") {
    // const finalAssetPayment = parseFloat(sharedPaymentAssetEstimate);
    // const finalNairaPayment =
    //   parseFloat(sharedPaymentNairaEstimate) -
    //   parseFloat(sharedNairaCharge.replace(/[^\d.]/g, ""));
    // console.log("Naira charger is :", sharedNairaCharge);
    // console.log(
    //   "We are setting setSharedPaymentNairaEstimate to:",
    //   finalNairaPayment.toString()
    // );

    // setSharedPaymentAssetEstimate(finalAssetPayment.toString());
    // setSharedPaymentNairaEstimate(finalNairaPayment.toString());
    // setSharedChargeForDB(
    //   `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
    // ),
    displaySearchBank();
    next({ stepId: "selectBank" });
  } else if (chatInput === "2") {
    // const finalAssetPayment =
    //   parseFloat(sharedPaymentAssetEstimate) +
    //   parseFloat(sharedCharge.replace(/[^\d.]/g, ""));
    // // const finalNairaPayment = parseFloat(sharedPaymentNairaEstimate);

    // console.log(
    //   "We are setting setSharedPaymentNairaEstimate to:",
    //   sharedPaymentNairaEstimate
    // );

    // setSharedPaymentAssetEstimate(finalAssetPayment.toString());
    // // setSharedPaymentNairaEstimate(finalNairaPayment.toString());
    // setSharedChargeForDB(
    //   `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
    // );
    displaySearchBank();
    next({ stepId: "selectBank" });
  } else {
    addMessages([
      {
        type: "incoming",
        content:
          "Invalid choice. Please choose with the options or say 'Hi' to start over.",
        timestamp: new Date(),
      },
    ]);
  }
  //   }
};

// HELP USER SELECT BANK FROM LIST
export const handleSelectBank = async (chatInput: string) => {
  const { next, prev, addMessages } = useChatStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      helloMenu("hi");
    })();
  } else if (chatInput === "0") {
    (() => {
      prev();
      //TODO: replace the chatInput with the provided amount
      displayCharge(chatInput);
    })();
  } else if (chatInput != "0") {
    const { setBankList, setBankNames } = useBankStore.getState();
    const { prev } = useChatStore.getState();
    let bankList: string[] = [];

    try {
      const bankNames = await fetchBankNames(chatInput.trim()).catch((e) => {
        console.log("There was an error");
        prev();
        return;
      });
      console.log("BankNames 1", bankNames);
      if (bankNames) {
        console.log("The bank name", bankNames["message"]);
        bankList = bankNames["message"];
        setBankList(bankList);
      }

      if (Array.isArray(bankList)) {
        const bankNameList = bankList.map((bank: string) =>
          bank.replace(/^\d+\.\s*/, "").replace(/\s\d+$/, "")
        );

        console.log("BankNames 1", bankNameList);
        setBankNames(bankNameList);
      } else {
        bankList = [];
        console.error("The fetched bank names are not in the expected format.");
      }
    } catch (error) {
      console.error("Failed to fetch bank names:", error);
    }

    displaySelectBank();
    next({ stepId: "enterAccountNumber" });
  }
};

//GET USER BANK DATA AFTER COLLECTING ACCOUNT NUMBER
export const handleBankAccountNumber = (chatInput: string) => {
  const { prev, next } = useChatStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      helloMenu("hi");
    })();
  } else if (chatInput === "0") {
    (() => {
      // console.log("THIS IS WHERE WE ARE");

      prev();
      displaySelectBank();
    })();
  } else if (chatInput != "0") {
    console.log(chatInput.trim());

    displayEnterAccountNumber(chatInput);
    next({ stepId: "continueToPay" });
  }
};
