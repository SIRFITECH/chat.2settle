import React from "react";

interface ShortenedAddressProps {
  wallet: string | undefined;
}

const ShortenedAddress = ({
  wallet,
}: ShortenedAddressProps): string | undefined => {

  if (!wallet || wallet.length <= 9) return wallet;

  const firstPart = wallet.slice(0, 5);
  const lastPart = wallet.slice(-4);

  return `${firstPart}...${lastPart}`;
};

export default ShortenedAddress;
