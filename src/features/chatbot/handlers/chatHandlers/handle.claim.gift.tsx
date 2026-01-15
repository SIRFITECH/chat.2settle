import { isGiftValid } from "@/services/transactionService/giftService/giftService";
import useChatStore from "stores/chatStore";
import { displaySearchBank } from "./menus/display.bank.search";

// export const handleClaimGift = (chatInput: string) => {
//   const { next, addMessages } = useChatStore.getState();
//   const giftId = chatInput.trim();
//   // check if gift is valid
//   // check if gift is not claimed yet
//   // move control to the enter search word
//   addMessages([
//     {
//       type: "incoming",
//       content: `You want to claim gift with GiftID ${giftId}`,
//       timestamp: new Date(),
//     },
//   ]);
//   return;
// };

export const handleClaimGift = async (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();
  const giftId = chatInput.trim();

  //   addMessages([
  //     {
  //       type: "incoming",
  //       content: `You want to claim gift with GiftID ${giftId}`,
  //       timestamp: new Date(),
  //     },
  //   ]);

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

  console.log(status, gift_status);

  if (
    status?.toLowerCase() === "successful" &&
    gift_status?.toLowerCase() === "not claimed"
  ) {
    displaySearchBank();
      next({ stepId: "enterBankSearchWord" });
      return;
  }

  if (gift_status?.toLowerCase() === "claimed") {
    addMessages([
      {
        type: "incoming",
        content: "This gift has already been claimed.",
        timestamp: new Date(),
      },
    ]);
    return;
  }

  if (status?.toLowerCase() === "processing") {
    addMessages([
      {
        type: "incoming",
        content:
          "The sender has not completed the transaction yet. Please try again later.",
        timestamp: new Date(),
      },
    ]);
    return;
  }

  addMessages([
    {
      type: "incoming",
      content:
        "This gift cannot be claimed because the payment was not completed.",
      timestamp: new Date(),
    },
  ]);
};
