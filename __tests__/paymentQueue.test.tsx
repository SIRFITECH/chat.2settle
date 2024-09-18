import { payoutMoney } from "@/helpers/api_calls";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Mocking the delay function (3 seconds)

jest.useFakeTimers();

interface PayoutResponse {
  status: string;
  transactionId: string;
}
describe("payoutMoney Queue", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    mock.onPost("/api/payout_gift").reply(200, { status: "success" });
  });

  afterEach(() => {
    mock.reset();
  });

  it("should handle 10 transactions one after the other with a 3-second delay between them", async () => {
    const data = {
      accountNumber: "8012345678",
      accountBank: "100010",
      bankName: "Opay",
      accountName: "SIRFITECH",
      amount: "10000",
      narration: "",
    };

    // Create an array of promises for 10 transactions
    const payoutPromises = [];
    for (let i = 0; i < 10; i++) {
      payoutPromises.push(payoutMoney(data));
    }

    // Call the first transaction
    const firstPayout = payoutPromises[0];

    // Process the first transaction
    await firstPayout;

    // Simulate the 3-second delay
    jest.advanceTimersByTime(3000);

    // Process the remaining transactions sequentially
    for (let i = 1; i < payoutPromises.length; i++) {
      await payoutPromises[i];
      jest.advanceTimersByTime(3000);
    }

    // Assert that the mock was called 10 times
    expect(mock.history.post.length).toBe(10);

    // Assert that all transactions were successful
    payoutPromises.forEach(async (promise) => {
      const result = (await promise) as PayoutResponse;
      expect(result.status).toBe("success");
    });
  });
});
