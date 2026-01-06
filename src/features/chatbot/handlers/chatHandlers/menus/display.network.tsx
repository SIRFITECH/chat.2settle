import useChatStore, { MessageType } from "stores/chatStore";

export const displayNetwork = () => {
  const { next, addMessages } = useChatStore.getState();
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          select Network: <br />
          <br />
          1. ERC20 <br />
          2. TRC20 <br />
          3. BEP20
          <br /> <br />
          0. Go back <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];

  console.log("Next is payOptions");
  //   sharedPaymentMode !== "request"
  //     ?
  next({ stepId: "payOptions" });
  //     :
  //   next({stepId: "continueToPay"});
  addMessages(newMessages);
};
