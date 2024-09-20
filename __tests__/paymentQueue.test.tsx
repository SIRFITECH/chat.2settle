import { addToPayoutQueue } from "@/helpers/api_calls";

jest.useFakeTimers();
global.setImmediate =
  global.setImmediate || ((fn: () => void) => setTimeout(fn, 0));

describe("Payout Queue Process", () => {
  test("should process payouts with 3 seconds delay between each, except the first one", async () => {
    // Create mock functions for the API calls
    const payoutCall1 = jest.fn(() => Promise.resolve());
    const payoutCall2 = jest.fn(() => Promise.resolve());
    const payoutCall3 = jest.fn(() => Promise.resolve());

    // Add payout calls to the queue
    addToPayoutQueue(payoutCall1);
    addToPayoutQueue(payoutCall2);
    addToPayoutQueue(payoutCall3);

    // Manually advance timers to start the first payout immediately
    await Promise.resolve(); // Wait for the async process to start
    expect(payoutCall1).toHaveBeenCalledTimes(1);

    // Fast-forward 10 seconds to trigger the second payout
    jest.advanceTimersByTime(10000);
    await Promise.resolve(); // Wait for the second payout to process
    expect(payoutCall2).toHaveBeenCalledTimes(1);

    // Fast-forward another 10 seconds to trigger the third payout
    jest.advanceTimersByTime(10000);
    await Promise.resolve(); // Wait for the third payout to process
    expect(payoutCall3).toHaveBeenCalledTimes(1);

    expect(payoutCall1).toHaveBeenCalledTimes(1);
    expect(payoutCall2).toHaveBeenCalledTimes(1);
    expect(payoutCall3).toHaveBeenCalledTimes(1);
  });
});

// describe("Payout Queue Process", () => {
//   test("should process 10 payouts with 3 seconds delay between each, except the first one", async () => {
//     // Create mock functions for 10 API calls
//     const payoutCalls = Array.from({ length: 10 }, () =>
//       jest.fn(() => Promise.resolve())
//     );

//     // Add payout calls to the queue
//     payoutCalls.forEach((call) => addToPayoutQueue(call));

//     // First call should be executed immediately
//     await Promise.resolve(); // Ensures the first async call is completed
//     expect(payoutCalls[0]).toHaveBeenCalledTimes(1);

//     // Manually advance timers and check each payout call one by one
//     for (let i = 1; i < payoutCalls.length; i++) {
//       jest.advanceTimersByTime(1000); // Fast-forward time by 3 seconds
//       await Promise.resolve(); // Ensure async completion
//       await new Promise(setImmediate); // Handle event loop with polyfill
//       expect(payoutCalls[i]).toHaveBeenCalledTimes(1); // Check call
//     }

//     // Ensure each payout call was made exactly once
//     payoutCalls.forEach((call) => {
//       expect(call).toHaveBeenCalledTimes(1);
//     });
//   }, 60000); // Set timeout to 35 seconds (for 10 transactions with 3-second intervals)
// });
