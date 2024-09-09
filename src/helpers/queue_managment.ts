import { WalletQueueWithLock } from "../types/wallet_types";

export async function simulatePaymentProcessing(walletQueue: WalletQueueWithLock) {
  // Assign a wallet for payment
  const wallet = await walletQueue.assignWallet();

  if (!wallet) {
    console.log("No wallet assigned.");
    return;
  }

  // Simulate payment processing
  await processPayment(wallet);

  // Once payment is done, move the wallet to the end of the queue
  walletQueue.completeTransaction(wallet);
  walletQueue.printQueue(); // Print the queue for debugging
}

export async function processQueue(walletQueue: WalletQueueWithLock) {
  while (!walletQueue.isEmpty()) {
    // Start the payment process
    await simulatePaymentProcessing(walletQueue);

    // Wait for 5 minutes before processing the next wallet
    await new Promise((resolve) => setTimeout(resolve, totalDuration));

    console.log("Moving to the next wallet after 5 minutes...");
  }

  console.log("All wallets have been processed.");
}


const totalDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
// Simulates the payment processing logic
async function processPayment(wallet: string): Promise<void> {
  console.log(`Processing payment for wallet: ${wallet}`);
  return new Promise((resolve) => setTimeout(resolve, totalDuration)); // Simulates async payment
}
