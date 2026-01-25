import { isGiftValid } from "@/services/transactionService/giftService/giftService";
import useChatStore from "stores/chatStore";
import { displaySearchBank } from "./menus/display.bank.search";

export const handleClaimGift = async (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();
  const giftId = chatInput.trim();

  const result = await isGiftValid(giftId);

  if (!result.exists || !result.user) {
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            I can not find this gift,
            <br />
            Please check the giftId
            <br />
            and be sure you are entering it correctly,
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
    return;
  }

  const { status, gift_status } = result.user;

  if (
    status?.toLowerCase() === "successful" &&
    gift_status?.toLowerCase() === "not claimed"
  ) {
    displaySearchBank();
    next({ stepId: "selectBank" });
    // next({ stepId: "enterBankSearchWord" });
  } else if (gift_status?.toLowerCase() === "claimed") {
    addMessages([
      {
        type: "incoming",
        content: "This gift has already been claimed.",
        timestamp: new Date(),
      },
    ]);
    return;
  } else if (status?.toLowerCase() === "processing") {
    addMessages([
      {
        type: "incoming",
        content:
          "The sender has not completed the transaction yet. Please try again later.",
        timestamp: new Date(),
      },
    ]);
    return;
  } else {
    addMessages([
      {
        type: "incoming",
        content:
          "This gift cannot be claimed because the payment was not completed.",
        timestamp: new Date(),
      },
    ]);
  }
};
