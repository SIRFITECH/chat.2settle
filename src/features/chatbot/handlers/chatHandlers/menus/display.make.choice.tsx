import { formatCurrency } from "@/helpers/format_currency";
import { fetchRate } from "@/services/rate/rates.service";
import { config } from "@/wagmi";
import useChatStore, { MessageType } from "stores/chatStore";
import { getAccount } from "wagmi/actions";
import { shortWallet } from "@/helpers/ShortenAddress";
import { useUserStore } from "stores/userStore";

export const displayMakeChoice = async () => {
      let rate: number | null = null;
    
      try {
        rate = await fetchRate();
      } catch (err) {
        console.error("Failed to fetch rate", err);
      }
      const account = getAccount(config);
      const { user } = useUserStore.getState();
    
      const walletIsConnected = account.isConnected;
      const wallet = account.address;
    
      const formatRate = formatCurrency(rate?.toString() ?? "0", "NGN", "en-NG");
    
      const telFirstName = user?.telegram?.username;
      const { next, addMessages } = useChatStore.getState();
     if (walletIsConnected) {
          addMessages([
            {
              type: "incoming",
              content: (
                <span>
                  How far {telFirstName} 👋
                  <br />
                  <br />
                  You are connected as <b>{shortWallet(wallet)}</b>
                  <br />
                  <br />
                  Your wallet is connected. The current rate is
                  <b> {formatRate}/$1</b>
                </span>
              ),
              timestamp: new Date(),
            },
            {
              type: "incoming",
              content: (
                <span>
                  1. Transact Crypto
                  <br />
                  2. Request for paycard
                  <br />
                  3. Customer support
                  <br />
                  4. Transaction ID
                  <br />
                  5. Reportly,
                </span>
              ),
            },
          ] as unknown as MessageType[]);
          next({
            stepId: "transactCrypto",
          });
        } else {
          {
            addMessages([
              {
                type: "incoming",
                content: (
                  <span>
                    You continued <b>without connecting your wallet</b>
                    <br />
                    <br />
                    Today Rate: <b>{formatRate}/$1</b> <br />
                    <br />
                    Welcome to 2SettleHQ {telFirstName}, how can I help you today?
                  </span>
                ),
                timestamp: new Date(),
              },
              {
                type: "incoming",
                content: (
                  <span>
                    1. Transact Crypto
                    <br />
                    2. Request for paycard
                    <br />
                    3. Customer support
                    <br />
                    4. Transaction ID
                    <br />
                    5. Reportly
                    <br />
                    0. Back
                  </span>
                ),
                timestamp: new Date(),
              },
            ]);
          }
          next({
            stepId: "makeAChoice",
          });
        }
}