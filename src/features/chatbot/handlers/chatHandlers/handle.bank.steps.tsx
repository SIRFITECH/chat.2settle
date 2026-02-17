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
import { formatCurrency } from "@/helpers/format_currency";
import { usePaymentStore } from "stores/paymentStore";
import { useTransactionStore } from "stores/transactionStore";
import { isGiftValid } from "@/services/transactionService/giftService/giftService";

// GET USER BANK DETAILS FROM NUBAN
export const handleSearchBank = async (chatInput: string) => {
  const { next, prev, addMessages } = useChatStore.getState();
  const {
    paymentAssetEstimate,
    paymentNairaEstimate,
    nairaCharge,
    dollarCharge,
    setPaymentAssetEstimate,
    setPaymentNairaEstimate,
    setAmountPayable,
  } = usePaymentStore.getState();

  const { setGiftId } = useTransactionStore.getState();
  const currentStep = useChatStore.getState().currentStep;
  const { paymentMode } = usePaymentStore.getState();

  // IS USER TRYING TO CLAIM GIFT?
  let wantsToSendGift =
    currentStep.transactionType?.toLowerCase().trim() === "gift";
  let wantsToClaimGift = paymentMode?.toLowerCase().trim() === "claim gift";
  let wantsToRequestPayment =
    currentStep.transactionType?.toLowerCase().trim() === "request";

  if (wantsToClaimGift) {
    console.log("USER WANTS TO CLAIM GIFT");
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        helloMenu("hi");
      })();
    } else if (chatInput.trim() === "0") {
      (() => {
        prev();
        // displayTransactIDWelcome();
      })();
    } else if (chatInput !== "0") {
      let giftExists;
      const gift_id = chatInput.trim();
      setGiftId(gift_id);
      try {
        giftExists = (await isGiftValid(gift_id)).exists;
      } catch (e) {
        console.log("Error getting gift", e);
      }
      console.log("Gift is", giftExists);
      // IF GIFT_ID EXIST IN DB,
      if (giftExists) {
        displaySearchBank();
        next({ stepId: "enterBankSearchWord" });
      } else {
        addMessages([
          {
            type: "incoming",
            content: "Invalid gift_id. Try again",
            timestamp: new Date(),
          },
        ]);
      }
    } else {
      addMessages([
        {
          type: "incoming",
          content:
            "Invalid choice. You need to choose an action from the options",
          timestamp: new Date(),
        },
      ]);
    }
  } else if (wantsToSendGift) {
    console.log("USER WANTS TO SEND GIFT");
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
      const finalAssetPayment = parseFloat(paymentAssetEstimate);
      const chargeAmount = parseFloat(nairaCharge.replace(/[^\d.]/g, ""));
      const nairaAmount = parseFloat(paymentNairaEstimate);

      // Validate charge is not greater than or equal to the amount
      if (chargeAmount >= nairaAmount) {
        addMessages([
          {
            type: "incoming",
            content: (
              <span>
                The charge ({formatCurrency(chargeAmount.toString(), "NGN", "en-NG")}) is greater than or equal to your amount.
                <br />
                Please select option 2 to add charges to the crypto amount instead.
              </span>
            ),
            timestamp: new Date(),
          },
        ]);
        return;
      }

      const finalNairaPayment = nairaAmount - chargeAmount;

      setPaymentAssetEstimate(finalAssetPayment.toString());
      setPaymentNairaEstimate(finalNairaPayment.toString());
      // setSharedChargeForDB(
      //   `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
      // ),
      displaySearchBank();
    } else if (chatInput === "2") {
      const finalAssetPayment = parseFloat(paymentAssetEstimate);
      const finalNairaPayment =
        parseFloat(paymentNairaEstimate) - parseFloat(nairaCharge);

      setPaymentAssetEstimate(finalAssetPayment.toString());
      setPaymentNairaEstimate(finalNairaPayment.toString());
      // setSharedChargeForDB(
      //   `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
      // );
      displaySearchBank();
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
  } else if (wantsToRequestPayment) {
    console.log("USER WANTS TO REQUEST PAYMENT");
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
    } else {
      chatInput = chatInput.replace(/[^0-9.]/g, "");
      if (Number(chatInput) >= 0 && Number(chatInput) <= 2000000) {
        const requestAmount = chatInput.trim();
        setPaymentNairaEstimate(requestAmount);

        displaySearchBank();
        next({ stepId: "selectBank" });
      } else {
        addMessages([
          {
            type: "incoming",
            content: (
              <span>
                You can only recieve <br />
                <b>Min: {formatCurrency("0", "NGN", "en-NG")}</b> and <br />
                <b>Max: {formatCurrency("2000000", "NGN", "en-NG")}</b>
              </span>
            ),
            timestamp: new Date(),
          },
        ]);
      }
    }
  } else {
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
      const finalAssetPayment = parseFloat(paymentAssetEstimate);
      const chargeAmount = parseFloat(nairaCharge.replace(/[^\d.]/g, ""));
      const nairaAmount = parseFloat(paymentNairaEstimate);

      // Validate charge is not greater than or equal to the amount
      if (chargeAmount >= nairaAmount) {
        addMessages([
          {
            type: "incoming",
            content: (
              <span>
                The charge ({formatCurrency(chargeAmount.toString(), "NGN", "en-NG")}) is greater than or equal to your amount.
                <br />
                Please select option 2 to add charges to the crypto amount instead.
              </span>
            ),
            timestamp: new Date(),
          },
        ]);
        return;
      }

      let finalNairaPayment = nairaAmount - chargeAmount;

      console.log("Charge from the Fiat", finalAssetPayment, finalNairaPayment);

      setPaymentAssetEstimate(finalAssetPayment.toFixed(8));
      setPaymentNairaEstimate(finalNairaPayment.toFixed(8));
      setAmountPayable(finalNairaPayment.toFixed(8));

      displaySearchBank();
      next({ stepId: "selectBank" });
    } else if (chatInput === "2") {
      console.log(
        "Final asset payment is from handle.bank.steps",
        paymentAssetEstimate,
      );

      let finalAssetPayment = parseFloat(paymentAssetEstimate);
      const finalNairaPayment = parseFloat(paymentNairaEstimate);

      // add charge to amount
      finalAssetPayment += parseFloat(dollarCharge);

      setPaymentAssetEstimate(finalAssetPayment.toFixed(8));
      setPaymentNairaEstimate(finalNairaPayment.toFixed(8));
      setAmountPayable(finalNairaPayment.toFixed(8));

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
  }
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
      const bankNames = await fetchBankNames(chatInput.trim());

      console.log("BankNames 1", bankNames);
      if (bankNames) {
        console.log("The bank name", bankNames["message"]);
        bankList = bankNames["message"];
        setBankList(bankList);
      }

      if (Array.isArray(bankList)) {
        const bankNameList = bankList.map((bank: string) =>
          bank.replace(/^\d+\.\s*/, "").replace(/\s\d+$/, ""),
        );

        console.log("BankNames 1", bankNameList);
        setBankNames(bankNameList);
      } else {
        bankList = [];
        console.error("The fetched bank names are not in the expected format.");
      }
    } catch (error) {
      console.error("Failed to fetch bank names:", error);
      addMessages([
        {
          type: "incoming",
          content: (
            <span>
              There was an error fetching your bank. <br />
              Please check to be sure the bank is a valid Nigerian Bank or MSB,
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      return;
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
