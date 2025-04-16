import { AddressPurpose, request } from "sats-connect";

interface ConnectResponse {
  paymentAddress?: string;
  ordinalsAddress?: string;
  stacksAddress?: string;
}

export async function connectXverseWallet(): Promise<ConnectResponse> {
  try {
    const response = await request("getAccounts", {
      purposes: [
        AddressPurpose.Payment,
        AddressPurpose.Ordinals,
        AddressPurpose.Stacks,
      ],
      message: "Please connect your Xverse Wallet to proceed.",
    });

    if (response.status === "success") {
      const addresses = response.result;

      const paymentAddress = addresses.find(
        (addr) => addr.purpose === AddressPurpose.Payment
      )?.address;
      const ordinalsAddress = addresses.find(
        (addr) => addr.purpose === AddressPurpose.Ordinals
      )?.address;
      const stacksAddress = addresses.find(
        (addr) => addr.purpose === AddressPurpose.Stacks
      )?.address;

      console.log({ paymentAddress, ordinalsAddress, stacksAddress });

      return { paymentAddress, ordinalsAddress, stacksAddress };
    } else {
      console.log("Error:", response.error);
      throw new Error(response.error.message);
      //   if (response.error.code === "USER_REJECTION") {
      //     throw new Error("User rejected the connection request.");
      //   } else {
      //     throw new Error(response.error.message);
      //   }
    }
  } catch (error) {
    console.error("Connection error", error);
    throw error;
  }
}
