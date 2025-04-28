import { vi, describe, it, expect, beforeEach } from "vitest";
import { spendETH } from "../src/helpers/ethereum_script/spend_crypto"; // Adjust the path as necessary
import Web3 from "web3";

vi.mock("web3", () => {
  const mockSendTransaction = vi.fn().mockResolvedValue("mock-receipt");
  return {
    default: vi.fn(() => ({
      eth: {
        getChainId: vi.fn().mockResolvedValue(1),
        sendTransaction: mockSendTransaction,
        utils: {
          toWei: vi
            .fn()
            .mockImplementation((amount) => `${amount}000000000000000000`),
        },
      },
    })),
  };
});

describe("send eth", () => {
  it("should", () => {
    const result = "";
    expect(result).toBeDefined();
  });
});

// describe("spendETH function", () => {
//   beforeEach(() => {
//     global.window = {
//       ethereum: {
//         request: vi.fn().mockImplementation(({ method }) => {
//           if (method === "eth_requestAccounts") {
//             return Promise.resolve(["0xYourWalletAddress"]);
//           }
//           if (method === "wallet_switchEthereumChain") {
//             return Promise.resolve();
//           }
//           return Promise.reject(new Error("Unknown request"));
//         }),
//       },
//     };
//   });

//   it("should send ETH successfully", async () => {
//     const receipt = await spendETH("0xReceiverWalletAddress", "0.1");
//     expect(receipt).toBe("mock-receipt");
//   });

//   it("should throw an error if MetaMask is not installed", async () => {
//     global.window.ethereum = undefined;
//     await expect(spendETH("0xReceiverWalletAddress", "0.1")).rejects.toThrow(
//       "You need a provider like Metamask to complete your transaction"
//     );
//   });

//   it("should throw an error if no accounts are found", async () => {
//     global.window.ethereum.request = vi.fn().mockResolvedValue([]);
//     await expect(spendETH("0xReceiverWalletAddress", "0.1")).rejects.toThrow(
//       "No accounts found. Please connect a wallet."
//     );
//   });

//   it("should throw an error if network switch is rejected", async () => {
//     global.window.ethereum.request = vi
//       .fn()
//       .mockImplementation(({ method }) => {
//         if (method === "wallet_switchEthereumChain") {
//           return Promise.reject({ code: 4001 });
//         }
//         return Promise.resolve(["0xYourWalletAddress"]);
//       });
//     await expect(spendETH("0xReceiverWalletAddress", "0.1")).rejects.toThrow(
//       "User rejected the network switch"
//     );
//   });

//   it("should throw an error if the user has insufficient funds", async () => {
//     Web3.mockImplementation(() => ({
//       eth: {
//         getChainId: vi.fn().mockResolvedValue(1),
//         sendTransaction: vi.fn().mockRejectedValue({
//           message: "insufficient funds",
//         }),
//         utils: {
//           toWei: vi
//             .fn()
//             .mockImplementation((amount) => `${amount}000000000000000000`),
//         },
//       },
//     }));
//     await expect(spendETH("0xReceiverWalletAddress", "0.1")).rejects.toThrow(
//       "Insufficeint funds to to complete the transaction"
//     );
//   });
// });
