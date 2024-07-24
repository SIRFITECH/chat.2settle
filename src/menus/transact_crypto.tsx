import React from "react";
import { MessageType, Result } from "../types/types";
import { formatCurrency } from "../helpers/format_currency";

// IF USER CHOOSE TRANSACT CRYPTO< THEY SEE THIS NEXT

export const displayTransactCrypto = (
  addChatMessages: (messages: MessageType[]) => void
) => {
  {
    const newMessages: MessageType[] = [
      {
        type: "incoming",
        content: (
          <span>
            Here is your menu:
            <br />
            1. Transfer money
            <br />
            2. Send Gift
            <br />
            3. Request for payment
            <br />
            0. Go back
          </span>
        ),
      },
    ];
    console.log("Next is howToEstimate");

    addChatMessages(newMessages);
  }
};

// IF USER CHOOSE TRANSFER MONEY THEY SEE THIS NEXT

export const displayTransferMoney = (
  addChatMessages: (messages: MessageType[]) => void
) => {
  console.log("Let's start with selecting an actions");
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Pay with:
          <br />
          <br />
          1. Bitcoin (BTC)
          <br />
          2. Ethereum (ETH)
          <br />
          3. BINANCE (BNB)
          <br />
          4. TRON (TRX)
          <br />
          5. USDT
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
    },
  ];
  console.log("Next is howToEstimate");

  addChatMessages(newMessages);
};

// USE CHOOSE WHICH WAY THEY WANT TO ESTIMATE THE PAY

export const displayHowToEstimation = (
  addChatMessages: (messages: MessageType[]) => void,
  input: string
) => {
  const parsedInput = input.trim();

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: `How would you like to estimate your ${parsedInput}?`,
    },
    {
      type: "incoming",
      content: (
        <span>
          Here is your menu:
          <br />
          <br />
          1. Naira
          <br />
          2. Dollar
          <br />
          3. Crypto
          <br />
          00. Exit
        </span>
      ),
    },
  ];

  console.log("Next is estimationAmount");
  //   nextStep("payOptions");
  addChatMessages(newMessages);
};

// IF THE USER WANT TO PAYE WITH USDT THEY USE

export const displayNetwork = (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void,
  input: string
) => {
  const parsedInput = input.trim();
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          select Network: <br />
          <br />
          1. ERC20 <br />
          2. TRC20 <br />
          3. BEP20
          <br /> <br />
          0. Go back <br />
          00. Exit
        </span>
      ),
    },
  ];

  console.log("Next is payOptions");
  nextStep("payOptions");
  addChatMessages(newMessages);
};

// THIS DISPLAYS ALLOWS USER TO ENTER THE AMOUNT HE WANTS TO PAY
export const displayPayIn = (
  addChatMessages: (messages: MessageType[]) => void,
  sharedEstimateAsset: string,
  sharedRate: string,
  sharedTicker: string,
  sharedAssetPrice: string,
  sharedCrypto: string
) => {
  const cryptocurrencies = ["btc", "eth", "trx", "bnb"];
  const dollar = ["usdt"];
  const isCrypto = cryptocurrencies.includes(sharedEstimateAsset.toLowerCase());
  const isDollar = dollar.includes(sharedEstimateAsset.toLowerCase());
  const rate = parseFloat(sharedRate);
  const upperDollar = 2000000 / rate;
  const lowerDollar = 20000 / rate;
  const assetPrice = parseFloat(sharedAssetPrice);
  let max: number;
  let min: number;
  if (sharedEstimateAsset.toLowerCase() === "dollar" || isDollar) {
    max = upperDollar;
    min = lowerDollar;
  } else {
    max = upperDollar / assetPrice;
    min = lowerDollar / assetPrice;
  }

  const rangeMessage =
    sharedEstimateAsset.toLowerCase() === "naira"
      ? `minimum amount = ${formatCurrency("20000", "NGN", "en-NG")},
         maximum amount = ${formatCurrency("2000000", "NGN", "en-NG")}`
      : sharedEstimateAsset.toLowerCase() === "dollar" || isDollar
      ? `minimum amount = ${formatCurrency(
          min.toFixed(2).toString(),
          "USD",
          "en-NG"
        )},  
        maximum amount = ${formatCurrency(max.toFixed(2).toString(), "USD")}.`
      : isCrypto
      ? `minimum amount = ${min.toFixed(5)} ${sharedTicker},  
        maximum amount = ${max.toFixed(5)} ${sharedTicker}.`
      : "";

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Enter the amount you want to send in {sharedEstimateAsset} value
          <br />
          <br />
          NOTE:
          <b> Note: {rangeMessage}.</b>
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
    },
  ];

  addChatMessages(newMessages);

  //   if (sharedCrypto.toLowerCase() === "usdt") {
  //     console.log("Estimate is in $$", sharedCrypto.toLowerCase());
  //     const rangeMessage =
  //       sharedEstimateAsset.toLowerCase() === "naira"
  //         ? `minimum amount = ${formatCurrency("20000", "NGN", "en-NG")},
  //          maximum amount = ${formatCurrency("2000000", "NGN", "en-NG")}`
  //         : sharedEstimateAsset.toLowerCase() === "dollar" || isDollar
  //         ? `minimum amount = ${formatCurrency(
  //             min.toFixed(2).toString(),
  //             "USD",
  //             "en-NG"
  //           )},
  //         maximum amount = ${formatCurrency(max.toFixed(2).toString(), "USD")}.`
  //         : isCrypto
  //         ? `minimum amount = ${min.toFixed(5)} ${sharedTicker},
  //         maximum amount = ${max.toFixed(5)} ${sharedTicker}.`
  //         : "";

  //     const newMessages: MessageType[] = [
  //       {
  //         type: "incoming",
  //         content: (
  //           <span>
  //             Enter the amount you want to send in {sharedEstimateAsset} value
  //             <br />
  //             <br />
  //             NOTE:
  //             <b> Note: {rangeMessage}.</b>
  //             <br />
  //             <br />
  //             0. Go back
  //             <br />
  //             00. Exit
  //           </span>
  //         ),
  //       },
  //     ];

  //     addChatMessages(newMessages);
  //   } else {
  //     console.log("Estimate is NOT in $$", sharedCrypto.toLowerCase());
  //     const rangeMessage =
  //       sharedEstimateAsset.toLowerCase() === "naira"
  //         ? `minimum amount = ${formatCurrency("20000", "NGN", "en-NG")},
  //          maximum amount = ${formatCurrency("2000000", "NGN", "en-NG")}`
  //         : sharedEstimateAsset.toLowerCase() === "dollar" || isDollar
  //         ? `minimum amount = ${formatCurrency(
  //             min.toFixed(2).toString(),
  //             "USD",
  //             "en-NG"
  //           )},
  //         maximum amount = ${formatCurrency(max.toFixed(2).toString(), "USD")}.`
  //         : isCrypto
  //         ? `minimum amount = ${min.toFixed(5)} ${sharedTicker},
  //         maximum amount = ${max.toFixed(5)} ${sharedTicker}.`
  //         : "";

  //     const newMessages: MessageType[] = [
  //       {
  //         type: "incoming",
  //         content: (
  //           <span>
  //             Enter the amount you want to send in {sharedEstimateAsset} value
  //             <br />
  //             <br />
  //             NOTE:
  //             <b> Note: {rangeMessage}.</b>
  //             <br />
  //             <br />
  //             0. Go back
  //             <br />
  //             00. Exit
  //           </span>
  //         ),
  //       },
  //     ];

  //     addChatMessages(newMessages);
  //   }
};

// DISPLAY USSER CHARGE
export const displayCharge = async (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void,
  input: string,
  sharedEstimateAsset: string,
  sharedRate: string,
  sharedAssetPrice: string,
  sharedCrypto: string,
  setSharedCharge: React.Dispatch<React.SetStateAction<string>>,
  setSharedPaymentAssetEstimate: React.Dispatch<React.SetStateAction<string>>,
  setSharedPaymentNairaEstimate: React.Dispatch<React.SetStateAction<string>>,
  setSharedNairaCharge: React.Dispatch<React.SetStateAction<string>>,
  setSharedChargeForDB: React.Dispatch<React.SetStateAction<string>>
) => {
  const cryptocurrencies = ["btc", "eth", "trx", "bnb"];
  const dollar = ["usdt"];
  const isCrypto = cryptocurrencies.includes(sharedEstimateAsset.toLowerCase());
  const isDollar = dollar.includes(sharedEstimateAsset.toLowerCase());
  const rate = parseFloat(sharedRate);
  const upperDollar = 2000000 / rate;
  const lowerDollar = 20000 / rate;
  const assetPrice = parseFloat(sharedAssetPrice);
  const parsedInput = input.trim();
  const dollarValue = parseFloat(parsedInput) * rate;
  const cryptoValue = parseFloat(parsedInput) * assetPrice * rate;
  let charge = 0;

  let max: number;
  let min: number;

  /**
   * Remember charges include
   * - input < NGN 100,000 = NGN 500
   * - NGN 100,000 < input > NGN 1,000,000 = NGN 1,000
   * - input > 1,000,000 == NGN 1,500
   */
  if (sharedCrypto.toLowerCase() === "usdt") {
    if (sharedEstimateAsset.toLowerCase() === "naira") {
      max = 2000000;
      min = 20000;
      const nairaValue = parseFloat(parsedInput);
      if (nairaValue <= max && nairaValue >= min) {
        var basic = 500 / rate;
        var median = 1000 / rate;
        var premium = 1500 / rate;

        charge =
          nairaValue <= 100000
            ? 500
            : nairaValue > 100000 && nairaValue <= 1000000
            ? 1000
            : 1500;

        const cryptoCharge =
          charge === 500
            ? basic
            : charge === 1000
            ? median
            : charge === 1500
            ? premium
            : 0;
        setSharedCharge(cryptoCharge.toString()); // the charge the user would pay in the choosen asset
        const cryptoPaymentEstimate = parseFloat(parsedInput) / rate; // this is the asset the user is paying, without charge
        setSharedPaymentAssetEstimate(cryptoPaymentEstimate.toString()); // this is the asset the person will send
        setSharedPaymentNairaEstimate(parsedInput); // this is the naira the person will recieve
        setSharedNairaCharge(charge.toString()); // this is the charge in naira
        setSharedChargeForDB(
          `${formatCurrency(
            cryptoPaymentEstimate.toString(),
            "USD",
            "en-NG"
          )} =  ${formatCurrency(charge.toString(), "NGN", "en-NG")}`
        );

        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Here is your menu:
                <br />
                <br />
                Charge:
                <b>
                  {formatCurrency(cryptoCharge.toFixed(9), "USD")}=
                  {formatCurrency(charge.toString(), "NGN", "en-NG")}
                </b>
                <br />
                1. Charge from the amount
                <br />
                2. Add charges to the amount
                <br />
                0. Go back
                <br />
                00. Exit
              </span>
            ),
          },
        ];

        console.log("Next is enterBankSearchWord");
        nextStep("enterBankSearchWord");
        addChatMessages(newMessages);
      } else {
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Invalid amount, try again within range
                <br />
              </span>
            ),
          },
        ];
        addChatMessages(newMessages);
        return;
      }
    } else if (sharedEstimateAsset.toLowerCase() === "dollar" || isDollar) {
      max = upperDollar;
      min = lowerDollar;
      if (parseFloat(parsedInput) <= max && parseFloat(parsedInput) >= min) {
        charge =
          dollarValue <= 100000
            ? 500
            : dollarValue > 100000 && dollarValue <= 1000000
            ? 1000
            : 1500;

        var basic = 500 / rate;
        var median = 1000 / rate;
        var premium = 1500 / rate;
        const cryptoCharge =
          charge === 500
            ? basic
            : charge === 1000
            ? median
            : charge === 1500
            ? premium
            : 0;

        setSharedCharge(cryptoCharge.toString()); // the charge the user would pay in the choosen asset
        const cryptoPaymentEstimate = parseFloat(parsedInput); // this is the asset the user is paying, without charge
        const nairaPaymentEstimate = parseFloat(parsedInput) * rate; // this is the asset the user is paying, without charge
        setSharedPaymentAssetEstimate(cryptoPaymentEstimate.toString()); // this is the asset the person will send
        setSharedPaymentNairaEstimate(nairaPaymentEstimate.toString()); // this is the naira the person will recieve
        setSharedNairaCharge(charge.toString()); // this is the charge in naira
        setSharedChargeForDB(
          `${formatCurrency(
            cryptoPaymentEstimate.toString(),
            "USD",
            "en-NG"
          )} =  ${formatCurrency(charge.toString(), "NGN", "en-NG")}`
        );

        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Here is your menu:
                <br />
                <br />
                Charge:
                <b>
                  {formatCurrency(cryptoCharge.toFixed(9).toString(), "USD")}=
                  {formatCurrency(charge.toString(), "NGN", "en-NG")}
                </b>
                <br />
                1. Charge from the amount
                <br />
                2. Add charges to the amount
                <br />
                0. Go back
                <br />
                00. Exit
              </span>
            ),
          },
        ];

        console.log("Next is enterBankSearchWord");
        nextStep("enterBankSearchWord");
        addChatMessages(newMessages);
      } else {
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Invalid amount, try again within range
                <br />
              </span>
            ),
          },
        ];
        addChatMessages(newMessages);
        return;
      }
    } else {
      max = upperDollar / rate;
      min = lowerDollar / rate;
      if (parseFloat(parsedInput) <= max && parseFloat(parsedInput) >= min) {
        charge =
          cryptoValue <= 100000
            ? 500
            : cryptoValue > 100000 && cryptoValue <= 1000000
            ? 1000
            : 1500;

        var basic = 500 / rate;
        var median = 1000 / rate;
        var premium = 1500 / rate;
        const cryptoCharge =
          charge === 500
            ? basic
            : charge === 1000
            ? median
            : charge === 1500
            ? premium
            : 0;

        setSharedCharge(cryptoCharge.toString()); // the charge the user would pay in the choosen asset
        const cryptoPaymentEstimate = parseFloat(parsedInput); // this is the asset the user is paying, without charge
        const nairaPaymentEstimate =
          parseFloat(parsedInput) * rate * assetPrice; // this is the asset the user is paying, without charge
        setSharedPaymentAssetEstimate(cryptoPaymentEstimate.toString()); // this is the asset the person will send
        setSharedPaymentNairaEstimate(nairaPaymentEstimate.toString()); // this is the naira the person will recieve
        setSharedNairaCharge(charge.toString()); // this is the charge in naira
        setSharedChargeForDB(
          `${formatCurrency(
            cryptoPaymentEstimate.toString(),
            "USD",
            "en-NG"
          )} =  ${formatCurrency(charge.toString(), "NGN", "en-NG")}`
        );

        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Here is your menu:
                <br />
                <br />
                Charge:
                <b>
                  {formatCurrency(cryptoCharge.toFixed(9), "NGN", "en-NG")}=
                  {formatCurrency(charge.toString(), "NGN", "en-NG")}
                </b>
                <br />
                1. Charge from the amount
                <br />
                2. Add charges to the amount
                <br />
                0. Go back
                <br />
                00. Exit
              </span>
            ),
          },
        ];

        console.log("Next is enterBankSearchWord");
        nextStep("enterBankSearchWord");
        addChatMessages(newMessages);
      } else {
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Invalid amount, try again within range
                <br />
              </span>
            ),
          },
        ];
        addChatMessages(newMessages);
        return;
      }
    }
  } else {
    if (sharedEstimateAsset.toLowerCase() === "naira") {
      max = 2000000;
      min = 20000;
      const nairaValue = parseFloat(parsedInput);
      if (nairaValue <= max && nairaValue >= min) {
        var basic = 500 / rate / assetPrice;
        var median = 1000 / rate / assetPrice;
        var premium = 1500 / rate / assetPrice;

        charge =
          nairaValue <= 100000
            ? 500
            : nairaValue > 100000 && nairaValue <= 1000000
            ? 1000
            : 1500;

        const cryptoCharge =
          charge === 500
            ? basic
            : charge === 1000
            ? median
            : charge === 1500
            ? premium
            : 0;
        setSharedCharge(cryptoCharge.toString()); // the charge the user would pay in the choosen asset
        const cryptoPaymentEstimate =
          parseFloat(parsedInput) / rate / assetPrice; // this is the asset the user is paying, without charge
        setSharedPaymentAssetEstimate(cryptoPaymentEstimate.toString()); // this is the asset the person will send
        setSharedPaymentNairaEstimate(parsedInput); // this is the naira the person will recieve
        setSharedNairaCharge(charge.toString()); // this is the charge in naira
        setSharedChargeForDB(
          `${cryptoPaymentEstimate.toString()} ${sharedCrypto} = ${formatCurrency(
            charge.toString(),
            "NGN",
            "en-NG"
          )}`
        );

        // console.log(
        //   "The value you are paying in your selected asset is :",
        //   cryptoPaymentEstimate
        // );
        // console.log("The charge in naira is :", charge);
        // console.log("The amount recieved in naira is :", parsedInput);
        // console.log("The amount sent in asset is :", cryptoPaymentEstimate);

        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Here is your menu:
                <br />
                <br />
                Charge:
                <b>
                  {cryptoCharge.toFixed(9)}
                  {sharedCrypto} =
                  {formatCurrency(charge.toString(), "NGN", "en-NG")}
                </b>
                <br />
                1. Charge from the amount
                <br />
                2. Add charges to the amount
                <br />
                0. Go back
                <br />
                00. Exit
              </span>
            ),
          },
        ];

        console.log("Next is enterBankSearchWord");
        nextStep("enterBankSearchWord");
        addChatMessages(newMessages);
      } else {
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Invalid amount, try again within range
                <br />
              </span>
            ),
          },
        ];
        addChatMessages(newMessages);
        return;
      }
    } else if (sharedEstimateAsset.toLowerCase() === "dollar" || isDollar) {
      max = upperDollar;
      min = lowerDollar;
      if (parseFloat(parsedInput) <= max && parseFloat(parsedInput) >= min) {
        charge =
          dollarValue <= 100000
            ? 500
            : dollarValue > 100000 && dollarValue <= 1000000
            ? 1000
            : 1500;

        var basic = 500 / rate / assetPrice;
        var median = 1000 / rate / assetPrice;
        var premium = 1500 / rate / assetPrice;

        const cryptoCharge =
          charge === 500
            ? basic
            : charge === 1000
            ? median
            : charge === 1500
            ? premium
            : 0;

        setSharedCharge(cryptoCharge.toString()); // the charge the user would pay in the choosen asset
        const cryptoPaymentEstimate = parseFloat(parsedInput); // this is the asset the user is paying, without charge
        const nairaPaymentEstimate = parseFloat(parsedInput) * rate; // this is the asset the user is paying, without charge
        setSharedPaymentAssetEstimate(cryptoPaymentEstimate.toString()); // this is the asset the person will send
        setSharedPaymentNairaEstimate(nairaPaymentEstimate.toString()); // this is the naira the person will recieve
        setSharedNairaCharge(charge.toString()); // this is the charge in naira
        setSharedChargeForDB(
          `${cryptoPaymentEstimate.toString()} ${sharedCrypto} = ${formatCurrency(
            charge.toString(),
            "NGN",
            "en-NG"
          )}`
        );

        console.log("crypto charge in dollar", cryptoCharge.toFixed(9));

        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Here is your menu:
                <br />
                <br />
                Charge:
                <b>
                  {cryptoCharge.toFixed(9)}
                  {sharedCrypto}=
                  {formatCurrency(charge.toString(), "NGN", "en-NG")}
                </b>
                <br />
                1. Charge from the amount
                <br />
                2. Add charges to the amount
                <br />
                0. Go back
                <br />
                00. Exit
              </span>
            ),
          },
        ];

        console.log("Next is enterBankSearchWord");
        nextStep("enterBankSearchWord");
        addChatMessages(newMessages);
      } else {
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Invalid amount, try again within range
                <br />
              </span>
            ),
          },
        ];
        addChatMessages(newMessages);
        return;
      }
    } else {
      max = upperDollar / assetPrice;
      min = lowerDollar / assetPrice;
      if (parseFloat(parsedInput) <= max && parseFloat(parsedInput) >= min) {
        charge =
          cryptoValue <= 100000
            ? 500
            : cryptoValue > 100000 && cryptoValue <= 1000000
            ? 1000
            : 1500;

        var basic = 500 / rate / assetPrice;
        var median = 1000 / rate / assetPrice;
        var premium = 1500 / rate / assetPrice;
        const cryptoCharge =
          charge === 500
            ? basic
            : charge === 1000
            ? median
            : charge === 1500
            ? premium
            : 0;

        setSharedCharge(cryptoCharge.toString()); // the charge the user would pay in the choosen asset
        const cryptoPaymentEstimate = parseFloat(parsedInput); // this is the asset the user is paying, without charge
        const nairaPaymentEstimate =
          parseFloat(parsedInput) * rate * assetPrice; // this is the asset the user is paying, without charge
        setSharedPaymentAssetEstimate(cryptoPaymentEstimate.toString()); // this is the asset the person will send
        setSharedPaymentNairaEstimate(nairaPaymentEstimate.toString()); // this is the naira the person will recieve
        setSharedNairaCharge(charge.toString()); // this is the charge in naira
        setSharedChargeForDB(
          `${cryptoPaymentEstimate.toString()} ${sharedCrypto} = ${formatCurrency(
            charge.toString(),
            "NGN",
            "en-NG"
          )}`
        );

        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Here is your menu:
                <br />
                <br />
                Charge:
                <b>
                  {cryptoCharge.toFixed(9)}
                  {sharedCrypto} =
                  {formatCurrency(charge.toString(), "NGN", "en-NG")}
                </b>
                <br />
                1. Charge from the amount
                <br />
                2. Add charges to the amount
                <br />
                0. Go back
                <br />
                00. Exit
              </span>
            ),
          },
        ];

        console.log("Next is enterBankSearchWord");
        nextStep("enterBankSearchWord");
        addChatMessages(newMessages);
      } else {
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Invalid Choice, Do you want to include charge or not?
                <br />
              </span>
            ),
          },
        ];
        addChatMessages(newMessages);
        return;
      }
    }
  }
};

// ALLOW USER ENTER BANK SEARCH CRITERIAL
export const displaySearchBank = async (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void,
  input: string,
  sharedEstimateAsset: string,
  sharedRate: string,
  sharedTicker: string,
  sharedAssetPrice: string
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Enter the first three letters of your Bank name.
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
    },
  ];
  console.log("Next is selectBank");
  nextStep("selectBank");
  addChatMessages(newMessages);
};

// SHOWS USER BANK DATA IN A LIST TO SELECT FROM
export const displaySelectBank = (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void,
  bankList: string[],
  setSharedBankCodes: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const results: Result[] = [];
  var bankCodes: string[] = [];

  bankList.forEach((bank) => {
    const match = bank.match(/^(\d+\.\s.+)\s(\d+)$/);
    if (match) {
      results.push({
        name: match[1],
        code: match[2],
      });
    }
  });

  if (results.length === 0) {
    const retryMessages: MessageType[] = [
      {
        type: "incoming",
        content: "No banks matched your input. Please try again:",
      },
    ];
    addChatMessages(retryMessages);

    return;
  }

  const bankOptions = results.map((result, index) => (
    <span key={index}>
      {result.name}
      <br />
    </span>
  ));

  results.map((result, index) => {
    bankCodes.push(results[index].code);
  });

  setSharedBankCodes(bankCodes);
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: "Enter the number of your bank:",
    },
    {
      type: "incoming",
      content: <>{bankOptions}</>,
    },
  ];
  console.log("Next is enterAccountNumber");
  nextStep("enterAccountNumber");
  addChatMessages(newMessages);
};
