import {
  checkUserExists,
  createUser,
  generateBTCWalletAddress,
  generateERCWalletAddress,
  generateTronWalletAddress,
  updateUser,
} from "./api_calls";

export async function asignWallet(
  sharedChatId: string,
  sharedNetwork: string,
  setSharedWallet: React.Dispatch<React.SetStateAction<string>>
) {
  const btcAddressPattern = /^(1|3|bc1)[a-zA-Z0-9]{25,39}$/;

  const erc20AddressPattern = /^0x[a-fA-F0-9]{40}$/;

  const trc20AddressPattern = /^T[a-zA-Z0-9]{33}$/;

  const erc20 = ["erc20", "bep20"];

  const userData = await checkUserExists(sharedChatId);
  let userExists = userData.exists;
  let hasBTCWallet = btcAddressPattern.test(
    userData.user?.bitcoin_wallet || ""
  );
  let hasERCWallet = erc20AddressPattern.test(
    userData.user?.eth_bnb_wallet || ""
  );
  let hasTRCWallet = trc20AddressPattern.test(userData.user?.tron_wallet || "");

  const tronWallet = await generateTronWalletAddress();

  if (userExists) {
    console.log("This user exists");
    if (sharedNetwork.toLocaleLowerCase() === "btc") {
      if (hasBTCWallet) {
        setSharedWallet(userData.user?.bitcoin_wallet || "");
      } else {
        const btcWallet = await generateBTCWalletAddress();
        setSharedWallet(btcWallet.bitcoin_wallet);
        // update the db
        updateUser(sharedChatId, {
          bitcoin_wallet: btcWallet.bitcoin_wallet,
          bitcoin_privateKey: btcWallet.bitcoin_privateKey,
        });
        console.log("User exist, new BTC wallet is:", btcWallet.bitcoin_wallet);
      }
    } else if (erc20.includes(sharedNetwork.toLocaleLowerCase())) {
      if (hasERCWallet) {
        setSharedWallet(userData.user?.eth_bnb_wallet || "");
      } else {
        const ercWallet = await generateERCWalletAddress();
        setSharedWallet(ercWallet.eth_bnb_wallet);
        // update the db
        updateUser(sharedChatId, {
          eth_bnb_wallet: ercWallet.eth_bnb_wallet,
          bitcoin_privateKey: ercWallet.eth_bnb_privateKey,
        });
        console.log("User exist, new ERC wallet is:", ercWallet.eth_bnb_wallet);
      }
    } else if (sharedNetwork.toLocaleLowerCase() === "trc20") {
      if (hasTRCWallet) {
        setSharedWallet(tronWallet.tron_wallet);
      } else {
        setSharedWallet(tronWallet.tron_wallet);
        updateUser(sharedChatId, {
          tron_wallet: tronWallet.tron_wallet,
          tron_privateKey: tronWallet.tron_privateKey,
        });
        console.log(
          "User exist and new tron wallet is:",
          tronWallet.tron_wallet
        );
      }
    }
  } else {
    if (sharedNetwork.toLocaleLowerCase() === "btc") {
      const btcWallet = await generateBTCWalletAddress();
      setSharedWallet(btcWallet.bitcoin_wallet);
      await createUser({
        agent_id: sharedChatId,
        bitcoin_wallet: btcWallet.bitcoin_wallet,
        bitcoin_privateKey: btcWallet.bitcoin_privateKey,
      });
      console.log("BTC wallet is:", btcWallet.bitcoin_wallet);
    } else if (erc20.includes(sharedNetwork.toLocaleLowerCase())) {
      const ercWallet = await generateERCWalletAddress();
      setSharedWallet(ercWallet.eth_bnb_wallet);
      await createUser({
        agent_id: sharedChatId,
        eth_bnb_wallet: ercWallet.eth_bnb_wallet,
        eth_bnb_privateKey: ercWallet.eth_bnb_privateKey,
      });
      console.log("ERC wallet is:", ercWallet.eth_bnb_wallet);
    } else if (sharedNetwork.toLocaleLowerCase() === "trc20") {
      setSharedWallet(tronWallet.tron_wallet);
      await createUser({
        agent_id: sharedChatId,
        tron_wallet: tronWallet.tron_wallet,
        tron_privateKey: tronWallet.tron_privateKey,
      });
      console.log("Tron wallet is:", tronWallet.tron_wallet);
    }
  }
}

export async function createTransaction() {
  // create a transaction in the db
}
