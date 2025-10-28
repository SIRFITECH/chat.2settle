import { describe, it, expect, vi, beforeEach } from "vitest";
type BalanceType = Record<string, number>;
vi.mock("web3", () => {
  const balances: BalanceType = {
    "0xmosnyik": 1000,
    "0xanotherwallet": 100,
  };

  const allowances: BalanceType = {};

  const makeKey = (owner: string, spender: string) => `${owner}_${spender}`;

  const mockContract = {
    methods: {
      balanceOf: vi.fn((address: string) => ({
        call: vi.fn().mockResolvedValue(balances[address] || 0),
      })),

      transfer: vi.fn((to: string, amount: number) => ({
        send: vi.fn(async ({ from }: { from: string }) => {
          if (!balances[from] || balances[from] < amount) {
            throw new Error("Insufficient balance");
          }

          balances[from] -= amount;
          balances[to] = (balances[to] || 0) + amount;

          return { status: true, from, to, transactionHash: "0x123" };
        }),
      })),

      approve: vi.fn((spender: string, amount: number) => ({
        send: vi.fn(async ({ from }: { from: string }) => {
          allowances[makeKey(from, spender)] = amount;
          return { status: true, from, spender, transactionHash: "0x456" };
        }),
      })),

      allowance: vi.fn((owner: string, spender: string) => ({
        call: vi.fn(async () => allowances[makeKey(owner, spender)] ?? 0),
      })),

      transferFrom: vi.fn((from: string, to: string, amount: number) => ({
        send: vi.fn(async ({ from: caller }: { from: string }) => {
          const key = makeKey(from, to);
          if ((allowances[key] || 0) < amount) {
            throw new Error("Allowance exceeded");
          }
          if (!balances[from] || balances[from] < amount) {
            throw new Error("Insufficient balance");
          }
          balances[from] -= amount;
          balances[to] = (balances[to] || 0) + amount;
          allowances[key] -= amount;

          return {
            status: true,
            from,
            to,
            caller,
            amount,
            transactionHash: "0x789",
          };
        }),
      })),
    },
  };

  return {
    default: vi.fn().mockImplementation(() => ({
      eth: {
        Contract: vi.fn().mockImplementation(() => mockContract),
      },
    })),
  };
});

import Web3 from "web3";

describe("Test USDT setup", () => {
  let web3: any;
  let usdt: any;

  beforeEach(() => {
    web3 = new Web3("https://mock-chain.local");
    usdt = new web3.eth.Contract([], "0xUSDTContractAddress");
  });

  it("should initiate USDT balances", async () => {
    const balance1 = await usdt.methods.balanceOf("0xmosnyik").call();
    const balance2 = await usdt.methods.balanceOf("0xanotherwallet").call();

    expect(balance1).toBe(1000);
    expect(balance2).toBe(100);
  });

  it("should transfer USDT between wallets", async () => {
    const receipt = await usdt.methods
      .transfer("0xanotherwallet", 200)
      .send({ from: "0xmosnyik" });

    expect(receipt.status).toBe(true);

    const balance1 = await usdt.methods.balanceOf("0xmosnyik").call();
    const balance2 = await usdt.methods.balanceOf("0xanotherwallet").call();
    expect(balance1).toBe(800);
    expect(balance2).toBe(300);
  });

  it("should approve and transferFrom USDT", async () => {
    const approveReceipt = await usdt.methods
      .approve("0xspender", 150)
      .send({ from: "0xmosnyik" });
    expect(approveReceipt.status).toBe(true);

    const allowance = await usdt.methods
      .allowance("0xmosnyik", "0xspender")
      .call();
    expect(allowance).toBe(150);
  });

  it("should transferFrom USDT using allowance", async () => {
    // First, approve the allowance
    await usdt.methods
      .approve("0xanotherwallet", 150)
      .send({ from: "0xmosnyik" });
    const receipt = await usdt.methods
      .transferFrom("0xmosnyik", "0xanotherwallet", 100)
      .send({ from: "0xanotherwallet" });
    expect(receipt.status).toBe(true);

    const balance1 = await usdt.methods.balanceOf("0xmosnyik").call();
    const balance2 = await usdt.methods.balanceOf("0xanotherwallet").call();
    expect(balance1).toBe(700);
    expect(balance2).toBe(400);
  });
});

describe("Test usdt bep20", () => {
  // usdt is transfered from caller to provided wallet
  it("", () => {});
  
  //the amount used id the amount transfered
  // the provided wallet have the amount transfered added
  // the transaction returns a TransactionReciept if successful or null if not
  // if wallet is not connected, throw an execption
  // const web3 = ;
  // web3.eth.mockResolveValue({});
});
// describe("bep20Service", () => {
//   it("should throw error if wallet is not connected while calling the function", () => {
//     //arrange
//     // act
//     //assert
//   });
// });
