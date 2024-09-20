import {
  checkUserHasHistory,
  handlePhoneNumber,
  sendOtp,
} from "@/helpers/api_call/history_page_calls";

// Mock the database and OTP service
jest.mock("./database");
jest.mock("./otpService");

describe("handlePhoneNumber", () => {
  const phoneNumber = "1234567890";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate and send OTP if the phone number exists", async () => {
    // Mock the database to return true for phone number check
    (checkUserHasHistory as jest.Mock).mockResolvedValue(true);

    // Mock sendOtp to resolve
    (sendOtp as jest.Mock).mockResolvedValue(true);

    // Call the function
    const otp = await handlePhoneNumber(phoneNumber);

    // Expectations
    expect(checkUserHasHistory).toHaveBeenCalledWith(phoneNumber);
    expect(sendOtp).toHaveBeenCalledWith(phoneNumber, expect.any(String));
    expect(otp).toHaveLength(6); // OTP should be 6 digits long
  });

  it("should throw an error if the phone number does not exist", async () => {
    // Mock the database to return false for phone number check
    (checkUserHasHistory as jest.Mock).mockResolvedValue(false);

    await expect(handlePhoneNumber(phoneNumber)).rejects.toThrow(
      "Phone number not found"
    );
    expect(checkUserHasHistory).toHaveBeenCalledWith(phoneNumber);
    expect(sendOtp).not.toHaveBeenCalled();
  });
});
