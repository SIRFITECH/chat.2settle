import axios from "axios";
import * as apiCalls from "../helpers/api_calls";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API Calls", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchRate", () => {
    it("should fetch and return the rate", async () => {
      mockedAxios.get.mockResolvedValue({ data: { rate: "750.5" } });
      const rate = await apiCalls.fetchRate();
      expect(rate).toBe(750.5);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rate`
      );
    });

    it("should throw an error if rate is invalid", async () => {
      mockedAxios.get.mockResolvedValue({ data: { rate: "invalid" } });
      await expect(apiCalls.fetchRate()).rejects.toThrow(
        "Invalid rate received"
      );
    });
  });

//   describe("fetchTotalVolume", () => {
//     it("should return the hardcoded volume", async () => {
//       const volume = await apiCalls.fetchTotalVolume();
//       expect(volume).toBe(800000);
//     });
//   });

//   describe("fetchMerchantRate", () => {
//     it("should fetch and return the merchant rate", async () => {
//       mockedAxios.get.mockResolvedValue({ data: { merchantRate: "760.5" } });
//       const rate = await apiCalls.fetchMerchantRate();
//       expect(rate).toBe(760.5);
//       expect(mockedAxios.get).toHaveBeenCalledWith(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/merchant_rate`
//       );
//     });

//     it("should throw an error if merchant rate is invalid", async () => {
//       mockedAxios.get.mockResolvedValue({ data: { merchantRate: "invalid" } });
//       await expect(apiCalls.fetchMerchantRate()).rejects.toThrow(
//         "Invalid rate received"
//       );
//     });
//   });

//   describe("checkUserExists", () => {
//     it("should check if a user exists", async () => {
//       const mockUser = { id: 1, name: "John Doe" };
//       mockedAxios.get.mockResolvedValue({
//         data: { exists: true, user: mockUser },
//       });
//       const result = await apiCalls.checkUserExists("1234567890");
//       expect(result).toEqual({ exists: true, user: mockUser });
//       expect(mockedAxios.get).toHaveBeenCalledWith("/api/check_user", {
//         params: { phone_number: "1234567890" },
//       });
//     });
//   });

//   describe("getAvaialableWallet", () => {
//     it("should return an available wallet", async () => {
//       const mockWallet = {
//         activeWallet: "0x123",
//         lastAssignedTime: "2023-01-01",
//       };
//       mockedAxios.get.mockResolvedValue({ status: 200, data: mockWallet });
//       const result = await apiCalls.getAvaialableWallet("ethereum");
//       expect(result).toEqual(mockWallet);
//       expect(mockedAxios.get).toHaveBeenCalledWith(
//         "/api/get_available_wallet",
//         { params: { network: "ethereum" } }
//       );
//     });

//     it("should throw an error if no wallet is found", async () => {
//       mockedAxios.get.mockResolvedValue({ status: 404 });
//       await expect(apiCalls.getAvaialableWallet("ethereum")).rejects.toThrow(
//         "No active wallet available for network: ethereum"
//       );
//     });
//   });

  // Add more tests for other functions...
});
