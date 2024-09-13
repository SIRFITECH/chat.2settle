class QueueWithLock {
  private queueItems: string[] = [];
  private isLocked: boolean = false; // Lock to prevent concurrent access

  constructor(wallets: string[]) {
    this.queueItems = wallets;
  }

  // Assigns a user for a new payment transaction
  async assignNewPayment(): Promise<string | undefined> {
    await this.acquireLock(); // Wait until lock is acquired

    if (this.isEmpty()) {
      console.log("No wallets available.");
      this.releaseLock(); // Release the lock before returning
      return undefined;
    }

    const payment = this.queueItems.shift(); // Get the wallet at the front of the queue
    console.log(`Assigned wallet: ${payment}`);
    this.releaseLock(); // Release the lock after operation
    return payment;
  }

  // Marks a wallet as available again and moves it to the end of the queue
  async completeTransaction(payment: string): Promise<void> {
    await this.acquireLock(); // Wait until lock is acquired
    // this.queueItems.push(payment); // Reinsert the wallet at the end
    console.log(`Wallet ${payment} is now available and moved to the end.`);
    this.releaseLock(); // Release the lock after operation
  }

  private acquireLock(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.isLocked) {
          this.isLocked = true;
          clearInterval(interval);
          resolve();
        }
      }, 100); // Check every 100ms
    });
  }

  private releaseLock(): void {
    this.isLocked = false;
  }

  isEmpty(): boolean {
    return this.queueItems.length === 0;
  }

  // Get the current size of the queue
  size(): number {
    return this.queueItems.length;
  }

  // Print the current queue for debugging
  printQueue(): void {
    console.log("Current Wallet Queue:", this.queueItems);
  }
}

export class WalletQueueWithLock {
  private wallets: string[] = [];
  private isLocked: boolean = false; // Lock to prevent concurrent access

  constructor(wallets: string[]) {
    this.wallets = wallets;
  }

  // Assigns a wallet for a new payment transaction
  async assignWallet(): Promise<string | undefined> {
    await this.acquireLock(); // Wait until lock is acquired

    if (this.isEmpty()) {
      console.log("No wallets available.");
      this.releaseLock(); // Release the lock before returning
      return undefined;
    }

    const wallet = this.wallets.shift(); // Get the wallet at the front of the queue
    console.log(`Assigned wallet: ${wallet}`);
    this.releaseLock(); // Release the lock after operation
    return wallet;
  }

  // Marks a wallet as available again and moves it to the end of the queue
  async completeTransaction(wallet: string): Promise<void> {
    await this.acquireLock(); // Wait until lock is acquired
    this.wallets.push(wallet); // Reinsert the wallet at the end
    console.log(`Wallet ${wallet} is now available and moved to the end.`);
    this.releaseLock(); // Release the lock after operation
  }

  private acquireLock(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.isLocked) {
          this.isLocked = true;
          clearInterval(interval);
          resolve();
        }
      }, 100); // Check every 100ms
    });
  }

  private releaseLock(): void {
    this.isLocked = false;
  }

  // Check if the queue is empty
  isEmpty(): boolean {
    return this.wallets.length === 0;
  }

  // Get the current size of the queue
  size(): number {
    return this.wallets.length;
  }

  // Print the current queue for debugging
  printQueue(): void {
    console.log("Current Wallet Queue:", this.wallets);
  }
}
