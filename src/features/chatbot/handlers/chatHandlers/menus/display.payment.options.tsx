import { formatCurrency } from "@/helpers/format_currency";
import { fetchRate } from "@/services/rate/rates.service";
import { cleanCurrencyToFloatString, getBaseSymbol } from "@/utils/utilities";
import useChatStore, { MessageType } from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
export const displayPayIn = async () => {
  const currentStep = useChatStore.getState().currentStep;
  const { addMessages } = useChatStore.getState();

  const { assetPrice: assetP, ticker } = usePaymentStore.getState();
  let usdtRate;
  try {
    usdtRate = await fetchRate();
  } catch (e) {
    console.log("There was an error fetching rate");
    throw new Error("Error refetching rate");
  }
  const estimateAsset = usePaymentStore.getState().estimateAsset;
  const assetSymbol = getBaseSymbol(ticker);

  const cryptocurrencies = ["btc", "eth", "trx", "bnb"];
  const dollar = ["usdt"];
  const isCrypto = cryptocurrencies.includes(assetSymbol.toLowerCase());
  const isDollar = dollar.includes(estimateAsset.toLowerCase());
  // clean the rate into a float string before parsing it
  const rate = parseFloat(cleanCurrencyToFloatString(usdtRate.toString()));
  const upperDollar = 2000000 / rate;
  const lowerDollar = 20000 / rate;
  const assetPrice = parseFloat(assetP.trim().replace(/[^\d.]/g, ""));
  let max: number;
  let min: number;
  if (estimateAsset.toLowerCase() === "dollar" || isDollar) {
    max = upperDollar;
    min = lowerDollar;
  } else {
    max = upperDollar / assetPrice;
    min = lowerDollar / assetPrice;
  }

  const rangeMessage = (
    <span >
      {estimateAsset.toLowerCase() === "naira" ? (
        <span>
          Min. = {formatCurrency("20000", "NGN", "en-NG")}
          <br />
          Max. = {formatCurrency("2000000", "NGN", "en-NG")}
        </span>
      ) : estimateAsset.toLowerCase() === "dollar" || isDollar ? (
        <span>
          Min. = {formatCurrency(min.toFixed(2).toString(), "USD", "en-NG")}
          <br />
          Max. = {formatCurrency(max.toFixed(2).toString(), "USD")}
        </span>
      ) : isCrypto ? (
        <span>
          Min. = {min.toFixed(5)} {assetSymbol}
          <br />
          Max. = {max.toFixed(5)} {assetSymbol}
        </span>
      ) : (
        ""
      )}
    </span>
  );
  console.log(
    "Just to see what sharedPaymentMode is:",
    currentStep.transactionType
  );
  const paymentMode =
    currentStep.transactionType === "transfer" ||
    currentStep.transactionType === "gift"
      ? "send"
      : "request";

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Enter the amount you want to {paymentMode} in {estimateAsset}(
          {assetSymbol}) value
          <br />
          <br />
          NOTE:
          <b> {rangeMessage}</b>
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];

  addMessages(newMessages);
};
