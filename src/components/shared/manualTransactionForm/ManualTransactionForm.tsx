"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TransactionBuilder } from "@/core/builders/transaction.builder";
import { createTransaction } from "@/helpers/api_calls";
import { formatPhoneNumber, generateTransactionId } from "@/utils/utilities";
import { format } from "date-fns";
import { formatCurrency } from "@/helpers/format_currency";
import { AssetSelector } from "./asset-selector";
import { NetworkSelector } from "./network-selector";
import { EstimationCurrencySelector } from "./estimation-currency-selector";
import { AmountInput } from "./amount-input";
import { ReceiverAmountInput } from "./receiver-amount-input";
import { RateInputs } from "./rate-inputs";
import { CryptoSentInput } from "./crypto-sent-input";
import { ChargeInput } from "./charge-input";
import { WalletAddressInput } from "./wallet-address-input";
import { TransactionDatePicker } from "./transaction-date-picker";
import { BankDetailsInputs } from "./bank-details-inputs";
import { CustomerNumberInput } from "./customer-number-input";
import { WalletAddress } from "@/lib/wallets/types";

// Define asset types and their default networks
export const ASSETS = [
  { value: "BTC", label: "Bitcoin (BTC)", defaultNetwork: "BTC" },
  { value: "ETH", label: "Ethereum (ETH)", defaultNetwork: "ERC20" },
  { value: "BNB", label: "Binance Coin (BNB)", defaultNetwork: "BEP20" },
  { value: "TRX", label: "TRON (TRX)", defaultNetwork: "TRC20" },
  { value: "USDT-ERC20", label: "USDT (ERC20)", defaultNetwork: "ERC20" },
  { value: "USDT-BEP20", label: "USDT (BEP20)", defaultNetwork: "BEP20" },
  { value: "USDT-TRC20", label: "USDT (TRC20)", defaultNetwork: "TRC20" },
];

// Define estimation currencies
export const ESTIMATION_CURRENCIES = [
  { value: "naira", label: "Naira (₦)" },
  { value: "dollar", label: "Dollar ($)" },
  { value: "crypto", label: "Crypto" },
];

// Define network options for USDT
export const USDT_NETWORKS = [
  { value: "ERC20", label: "ERC20 (Ethereum)" },
  { value: "BEP20", label: "BEP20 (Binance Smart Chain)" },
  { value: "TRC20", label: "TRC20 (TRON)" },
];

export interface FormData {
  asset: string;
  network: string;
  estimation: string;
  amount: string;
  charge: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  customerNumber: string;
  receiverAmount: string;
  currentRate: string;
  cryptoSent: string;
  merchantRate: string;
  profitRate: string;
  walletAddress: WalletAddress;
  transactionDate: Date;
}

export default function CryptoTransactionForm() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    asset: "",
    network: "",
    estimation: "naira",
    amount: "",
    charge: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    customerNumber: "",
    receiverAmount: "",
    currentRate: "",
    cryptoSent: "",
    merchantRate: "",
    profitRate: "",
    walletAddress: "" as unknown as WalletAddress,
    transactionDate: new Date(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle asset selection and auto-populate network
  const handleAssetChange = (value: string) => {
    const selectedAsset = ASSETS.find((asset) => asset.value === value);

    setFormData({
      ...formData,
      asset: value,
      // Auto-populate network based on asset selection
      network: selectedAsset?.defaultNetwork || "",
    });
  };

  // Build transaction object using the builder pattern
  const buildTransactionObject = () => {
    // Generate unique IDs for the transaction
    const transactionId = generateTransactionId();

    // Format date as string
    const formattedDate = format(formData.transactionDate, "h:mma dd/MM/yyyy");

    const merchantRate =
      Number.parseFloat(formData.currentRate) +
      Number.parseFloat(formData.profitRate);

    // Use the builder pattern to create the transaction
    const transaction = new TransactionBuilder()
      .setCrypto(formData.asset)
      .setNetwork(formData.network)
      .setEstimation(
        formData.estimation === "crypto"
          ? formData.asset.split("-")[0] // Use the asset value (BTC, ETH, etc.) when estimation is crypto
          : formData.estimation.charAt(0).toUpperCase() +
              formData.estimation.slice(1)
      )
      .setAmount(formData.amount)
      .setCharges(formatCurrency(formData.charge, "NGN", "en-NG"))
      .setModeOfPayment("transferMoney")
      .setBankAcctNumb(formData.accountNumber)
      .setBankName(formData.bankName)
      .setReceiverName(formData.accountName)
      .setReceiverAmount(
        formatCurrency(formData.receiverAmount, "NGN", "en-NG")
      )
      .setCryptoSent(`${formData.cryptoSent} ${formData.asset.split("-")[0]}`)
      .setWalletAddress(formData.walletAddress?.trim())
      .setDate(formattedDate)
      .setStatus("Successful")
      .setCustomerPhoneNumber(formatPhoneNumber(formData.customerNumber))
      .setCurrentRate(formatCurrency(formData.currentRate, "NGN", "en-NG"))
      .setMerchantRate(formatCurrency(merchantRate.toString(), "NGN", "en-NG"))
      .setProfitRates(formatCurrency(formData.profitRate, "NGN", "en-NG"))
      .setAssetPrice(formatCurrency(formData.currentRate, "NGN", "en-NG"))
      .setTransacId(transactionId.toString())
      .setSettleWalletLink("")
      .setRefCode("")
      .buildTransaction();

    return transaction;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.asset ||
      !formData.network ||
      !formData.amount ||
      !formData.bankName ||
      !formData.accountNumber ||
      !formData.customerNumber ||
      !formData.receiverAmount ||
      !formData.currentRate ||
      !formData.cryptoSent ||
      !formData.walletAddress
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate account number length
    if (formData.accountNumber.length > 10) {
      toast({
        title: "Error",
        description: "Account number must not be more than 10 digits",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number length
    if (formData.customerNumber.length !== 11) {
      toast({
        title: "Error",
        description: "Customer phone number must be exactly 11 digits",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Build the transaction object using the builder pattern
      const transaction = buildTransactionObject();

      // Save the transaction to the database
      await createTransaction(transaction);

      toast({
        title: "Success",
        description: "Transaction details submitted successfully",
      });

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error submitting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to submit transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto mt-6 mb-6">
        <CardHeader>
          <CardTitle>Add New Transaction Manually</CardTitle>
          <CardDescription>
            Enter the details for your crypto transaction
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Asset Selection */}
              <AssetSelector
                value={formData.asset}
                onChange={handleAssetChange}
              />

              {/* Network Selection */}
              <NetworkSelector
                asset={formData.asset}
                value={formData.network}
                onChange={(value) =>
                  setFormData({ ...formData, network: value })
                }
              />

              {/* Estimation Currency */}
              <EstimationCurrencySelector
                value={formData.estimation}
                onChange={(value) =>
                  setFormData({ ...formData, estimation: value })
                }
              />

              {/* Amount */}
              <AmountInput
                value={formData.amount}
                estimation={formData.estimation}
                asset={formData.asset}
                onChange={(value) =>
                  setFormData({ ...formData, amount: value })
                }
              />

              {/* Receiver Amount */}
              <ReceiverAmountInput
                value={formData.receiverAmount}
                onChange={(value) =>
                  setFormData({ ...formData, receiverAmount: value })
                }
              />

              {/* Rate Inputs (Current, Merchant, Profit) */}
              <RateInputs
                currentRate={formData.currentRate}
                profitRate={formData.profitRate}
                onCurrentRateChange={(value) =>
                  setFormData({ ...formData, currentRate: value })
                }
                onProfitRateChange={(value) =>
                  setFormData({ ...formData, profitRate: value })
                }
              />

              {/* Crypto Sent */}
              <CryptoSentInput
                value={formData.cryptoSent}
                asset={formData.asset}
                onChange={(value) =>
                  setFormData({ ...formData, cryptoSent: value })
                }
              />

              {/* Charge */}
              <ChargeInput
                value={formData.charge}
                onChange={(value) =>
                  setFormData({ ...formData, charge: value })
                }
              />

              {/* Wallet Address */}
              <WalletAddressInput
                value={formData.walletAddress}
                onChange={(value) =>
                  setFormData({ ...formData, walletAddress: value })
                }
              />

              {/* Transaction Date */}
              <TransactionDatePicker
                date={formData.transactionDate}
                onDateChange={(date) => {
                  if (date) {
                    // Preserve the time from the current date
                    const currentDate = formData.transactionDate;
                    date.setHours(currentDate.getHours());
                    date.setMinutes(currentDate.getMinutes());

                    setFormData({
                      ...formData,
                      transactionDate: date,
                    });
                  }
                }}
                onTimeChange={(hours, minutes) => {
                  const newDate = new Date(formData.transactionDate);
                  newDate.setHours(hours);
                  newDate.setMinutes(minutes);

                  setFormData({
                    ...formData,
                    transactionDate: newDate,
                  });
                }}
              />

              {/* Bank Details */}
              <BankDetailsInputs
                bankName={formData.bankName}
                accountNumber={formData.accountNumber}
                accountName={formData.accountName}
                onBankNameChange={(value) =>
                  setFormData({ ...formData, bankName: value })
                }
                onAccountNumberChange={(value) =>
                  setFormData({ ...formData, accountNumber: value })
                }
                onAccountNameChange={(value) =>
                  setFormData({ ...formData, accountName: value })
                }
              />

              {/* Customer Number */}
              <CustomerNumberInput
                value={formData.customerNumber}
                onChange={(value) =>
                  setFormData({ ...formData, customerNumber: value })
                }
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                router.push("/");
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-400"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Transaction"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
