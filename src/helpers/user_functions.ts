import {
  checkUserExists,
  createUser,
  generateBTCWalletAddress,
  generateERCWalletAddress,
  generateTronWalletAddress,
} from "./api_calls";

export async function asignWallet(
  sharedChatId: string,
  setSharedWallet: React.Dispatch<React.SetStateAction<string>>
) {
  const btcAddressPattern = /^(1|3|bc1)[a-zA-Z0-9]{25,39}$/;

  const erc20AddressPattern = /^0x[a-fA-F0-9]{40}$/;

  const trc20AddressPattern = /^T[a-zA-Z0-9]{33}$/;

  const userData = await checkUserExists(sharedChatId);
  let userExists = userData.exists;
  let hasBTCWallet = btcAddressPattern.test(
    userData.user?.bitcoin_wallet || ""
  );
  let hasERCWallet = erc20AddressPattern.test(
    userData.user?.eth_bnb_wallet || ""
  );
  let hasTRCWallet = trc20AddressPattern.test(userData.user?.tron_wallet || "");

  const btcWallet = await generateBTCWalletAddress();
  const ercWallet = await generateERCWalletAddress();
  const tronWallet = await generateTronWalletAddress();

  // console.log("BTC wallet:", btcWallet.bitcoin_wallet);
  // console.log("ERC wallet:", ercWallet);
  // console.log("TRON wallet:", tronWallet);
  // console.log("Shared ChatId:", sharedChatId);

  if (userExists) {
    if (hasBTCWallet) {
      console.log("His wallet address is:", userData.user?.bitcoin_wallet);
      // fetch the wallet and set it to the sharedWallet
      setSharedWallet(userData.user?.bitcoin_wallet || "");
    } else {
      const btcWallet = await generateBTCWalletAddress();
      console.log("BTC wallet:", btcWallet.bitcoin_wallet);
      setSharedWallet(btcWallet.bitcoin_wallet);
      // await updateUser("497506", {
      //   bitcoin_wallet: btcWallet.bitcoin_wallet,
      //   bitcoin_privateKey: btcWallet.bitcoin_privateKey,
      // });
    }

    if (hasERCWallet) {
    } else {
    }

    if (hasTRCWallet) {
    } else {
    }
  } else {
    // eth_bnb_wallet,
    // eth_bnb_privateKey,
    // tron_wallet,
    // tron_privateKey,
    const btcWallet = await generateBTCWalletAddress();
    console.log("BTC wallet:", btcWallet.bitcoin_wallet);
    setSharedWallet(btcWallet.bitcoin_wallet);
    await createUser({
      agent_id: sharedChatId,
      bitcoin_wallet: btcWallet.bitcoin_wallet,
      bitcoin_privateKey: btcWallet.bitcoin_privateKey,
    });
    console.log(
      "User doesn't exists and does he have wallet address?",
      hasBTCWallet
    );
  }
}
