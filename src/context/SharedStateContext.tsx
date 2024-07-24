import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { getChatId } from "../utils/utilities";
import { SharedStateContextProps } from "../types/types";

const SharedStateContext = createContext<SharedStateContextProps | undefined>(
  undefined
);

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error("useSharedState must be used within a SharedStateProvider");
  }
  return context;
};

export const SharedStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sharedState, setSharedState] = useState<string>("");
  const [sharedRate, setSharedRate] = useState<string>("");
  const [sharedChatId, setSharedChatId] = useState<string>("");
  const [sharedPaymentMode, setSharedPaymentMode] = useState<string>("");
  const [sharedCrypto, setSharedCrypto] = useState<string>("");
  const [sharedTicker, setSharedTicker] = useState<string>("");
  const [sharedNetwork, setSharedNetwork] = useState<string>("");
  const [sharedWallet, setSharedWallet] = useState<string>("");
  const [sharedAssetPrice, setSharedAssetPrice] = useState<string>("");
  const [sharedEstimateAsset, setSharedEstimateAsset] = useState<string>("");
  const [sharedAmount, setSharedAmount] = useState<string>("");
  const [sharedCharge, setSharedCharge] = useState<string>("");
  const [sharedPaymentAssetEstimate, setSharedPaymentAssetEstimate] =
    useState<string>("");
  const [sharedPaymentNairaEstimate, setSharedPaymentNairaEstimate] =
    useState<string>("");
  const [sharedNairaCharge, setSharedNairaCharge] = useState<string>("");
  const [sharedChargeForDB, setSharedChargeForDB] = useState<string>("");
  const [sharedBankCodes, setSharedBankCodes] = useState<string[]>([]);
  const [sharedBankNames, setSharedBankNames] = useState<string[]>([]);

  useEffect(() => {
    const chatId = getChatId();
    if (chatId) {
      const storedData = localStorage.getItem(`sharedState-${chatId}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setSharedState(parsedData.sharedState);
        setSharedRate(parsedData.sharedRate);
      }
    }
  }, []);

  useEffect(() => {
    const chatId = getChatId();
    if (chatId) {
      const chatData = {
        sharedState,
        sharedRate,
      };
      localStorage.setItem(`sharedState-${chatId}`, JSON.stringify(chatData));
    }
  }, [sharedState, sharedRate]);

  return (
    <SharedStateContext.Provider
      value={{
        sharedState,
        setSharedState,
        sharedRate,
        setSharedRate,
        sharedChatId,
        setSharedChatId,
        sharedPaymentMode,
        setSharedPaymentMode,
        sharedCrypto,
        setSharedCrypto,
        sharedTicker,
        setSharedTicker,
        sharedNetwork,
        setSharedNetwork,
        sharedWallet,
        setSharedWallet,
        sharedAssetPrice,
        setSharedAssetPrice,
        sharedEstimateAsset,
        setSharedEstimateAsset,
        sharedAmount,
        setSharedAmount,
        sharedCharge,
        setSharedCharge,
        sharedPaymentAssetEstimate,
        setSharedPaymentAssetEstimate,
        sharedPaymentNairaEstimate,
        setSharedPaymentNairaEstimate,
        sharedNairaCharge,
        setSharedNairaCharge,
        sharedChargeForDB,
        setSharedChargeForDB,
        sharedBankCodes,
        setSharedBankCodes,
        sharedBankNames,
        setSharedBankNames,
      }}
    >
      {children}
    </SharedStateContext.Provider>
  );
};
