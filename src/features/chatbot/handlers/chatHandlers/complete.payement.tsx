import { fetchBankDetails } from "@/services/bank/bank.service";
import { useBankStore } from "stores/bankStore";
import useChatStore, { MessageType } from "stores/chatStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displaySearchBank } from "./menus/display.bank.search";
import { displayContinueToPay } from "./menus/display.continue.pay";

export const handleContinueToPay = async (chatInput: string) => {
  const { prev, next, addMessages } = useChatStore.getState();
  const { selectedBankCode, selectedBankName, updateBankData } =
    useBankStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    prev();
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      next({ stepId: "start" });
      helloMenu("hi");
    })();
  } else if (chatInput === "0") {
    (() => {
      // console.log("THIS IS WHERE WE ARE");
      prev();
      displaySearchBank();
    })();
  } else if (chatInput !== "0") {
     let bank_name = "";
     let account_name = "";
     let account_number = "";

     try {
       const bankData = await fetchBankDetails(
         selectedBankCode,
         chatInput.trim(),
       );

       if (!bankData || bankData.length === 0) {
         const newMessages: MessageType[] = [
           {
             type: "incoming",
             content: (
               <span>
                 There was an issue getting your bank details, please try again
               </span>
             ),
             timestamp: new Date(),
           },
         ];
         addMessages(newMessages);
         return;
       }

       bank_name = bankData[0].bank_name;
       account_name = bankData[0].account_name;
       account_number = bankData[0].account_number;

       if (!account_number) {
         const newMessages: MessageType[] = [
           {
             type: "incoming",
             content: <span>Invalid account number. Please try again.</span>,
             timestamp: new Date(),
           },
         ];
         addMessages(newMessages);
         return; // Exit the function to let the user try again
       }

       updateBankData({
         acct_number: account_number,
         bank_name: selectedBankName,
         receiver_name: account_name,
       });
       displayContinueToPay();

       next({ stepId: "enterPhone" });
     } catch (error) {
       console.error("Failed to fetch bank data:", error);
       const errorMessage: MessageType[] = [
         {
           type: "incoming",
           content: (
             <span>
               Failed to fetch bank data. Please check your accouunt number and
               try again.
             </span>
           ),
           timestamp: new Date(),
         },
       ];
       addMessages(errorMessage);
     }
 
  }
};
