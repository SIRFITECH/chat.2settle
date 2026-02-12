import { isRequestValid } from "@/services/transactionService/requestService/requestService";
import useChatStore from "stores/chatStore";
import { displayTransferMoney } from "./menus/transfer.money";

export const handlePayRequest = async (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();
  const requestId = chatInput.trim();

  const result = await isRequestValid(requestId);

  if (!result.exists || !result.user) {
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            I can not find this request,
            <br />
            Please check the requestId
            <br />
            and be sure you are entering it correctly,
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
    return;
  }

  const { request_status } = result.user;

  if (request_status?.toLowerCase() === "pending") {
    displayTransferMoney();
    next({
      stepId: "transactCrypto",
      transactionType: "transfer",
    });
    return;
  }

  //   if (gift_status?.toLowerCase() === "claimed") {
  //     addMessages([
  //       {
  //         type: "incoming",
  //         content: "This gift has already been claimed.",
  //         timestamp: new Date(),
  //       },
  //     ]);
  //     return;
  //   }

  //   if (status?.toLowerCase() === "processing") {
  //     addMessages([
  //       {
  //         type: "incoming",
  //         content:
  //           "The sender has not completed the transaction yet. Please try again later.",
  //         timestamp: new Date(),
  //       },
  //     ]);
  //     return;
  //   }

  addMessages([
    {
      type: "incoming",
      content:
        "This request cannot be fullfilled because the request is incomplete.",
      timestamp: new Date(),
    },
  ]);
};
