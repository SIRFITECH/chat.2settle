import { payoutMoney } from "@/helpers/api_calls";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("payoutMoney", () => {
  let mock: MockAdapter;

  // Set up the mock adapter before each test
  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  // Reset the mock adapter after each test
  afterEach(() => {
    mock.reset();
  });

  it("should resolve successfully when API call is successful", async () => {
    const mockData = { status: "success", transactionId: "12345" };

    // Mock the API response
    mock.onPost("/api/payout_gift").reply(200, mockData);

    const data = {
      accountNumber: "8012345678",
      accountBank: "100010",
      bankName: "Opay",
      accountName: "SIRFITECH",
      amount: "10000",
      narration: "",
    };

    // Call the function
    const response = await payoutMoney(data);

    // Assert that the response is as expected
    expect(response).toEqual(mockData);
  });

  it("should reject with an error when the API call fails", async () => {
    const mockError = { message: "Transaction failed" };

    // Mock the API response to simulate a failure
    mock.onPost("/api/payout_gift").reply(400, mockError);

    const data = {
      accountNumber: "8012345678",
      accountBank: "100010",
      bankName: "Opay",
      accountName: "SIRFITECH",
      amount: "10000",
      narration: "",
    };

    // Test that the promise rejects with the correct error
    await expect(payoutMoney(data)).rejects.toThrow("Transaction failed");
  });

  it("should reject with internal server error when there is no response", async () => {
    // Simulate a network error (no response)
    mock.onPost("/api/payout_gift").networkError();

    const data = {
      accountNumber: "8012345678",
      accountBank: "100010",
      bankName: "Opay",
      accountName: "SIRFITECH",
      amount: "10000",
      narration: "",
    };

    // Test that the promise rejects with "Internal Server Error"
    await expect(payoutMoney(data)).rejects.toThrow("Internal Server Error");
  });
});
