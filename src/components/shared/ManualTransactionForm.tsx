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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Define asset types and their default networks
const ASSETS = [
  { value: "BTC", label: "Bitcoin (BTC)", defaultNetwork: "BTC" },
  { value: "ETH", label: "Ethereum (ETH)", defaultNetwork: "ERC20" },
  { value: "BNB", label: "Binance Coin (BNB)", defaultNetwork: "BEP20" },
  { value: "TRX", label: "TRON (TRX)", defaultNetwork: "TRC20" },
  { value: "USDT-ERC20", label: "USDT (ERC20)", defaultNetwork: "ERC20" },
  { value: "USDT-BEP20", label: "USDT (BEP20)", defaultNetwork: "BEP20" },
  { value: "USDT-TRC20", label: "USDT (TRC20)", defaultNetwork: "TRC20" },
];

// Define estimation currencies
const ESTIMATION_CURRENCIES = [
  { value: "naira", label: "Naira (₦)" },
  { value: "dollar", label: "Dollar ($)" },
  { value: "crypto", label: "Crypto" },
];

// Define network options for USDT
const USDT_NETWORKS = [
  { value: "ERC20", label: "ERC20 (Ethereum)" },
  { value: "BEP20", label: "BEP20 (Binance Smart Chain)" },
  { value: "TRC20", label: "TRC20 (TRON)" },
];

export default function CryptoTransactionForm({
  onClose,
}: {
  onClose: () => void;
}) {
  // Form state
  const [formData, setFormData] = useState({
    asset: "",
    network: "",
    estimation: "naira",
    amount: "",
    charge: "",
    bankName: "",
    accountNumber: "",
    customerNumber: "",
  });

  // Determine if the selected asset is USDT
  const isUSDT = formData.asset.startsWith("USDT");

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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.asset ||
      !formData.network ||
      !formData.amount ||
      !formData.bankName ||
      !formData.accountNumber ||
      !formData.customerNumber
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });

      return;
    }

    // Process form submission
    console.log("Form submitted:", formData);
    toast({
      title: "Success",
      description: "Transaction details submitted successfully",
    });

    // Close the form

    onClose();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Crypto Transaction</CardTitle>
        <CardDescription>
          Enter the details for your crypto transaction
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset Selection */}
            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Select value={formData.asset} onValueChange={handleAssetChange}>
                <SelectTrigger id="asset">
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cryptocurrencies</SelectLabel>
                    {ASSETS.map((asset) => (
                      <SelectItem key={asset.value} value={asset.value}>
                        {asset.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Network Selection */}
            <div className="space-y-2">
              <Label htmlFor="network">Network</Label>
              {isUSDT ? (
                <Select
                  value={formData.network}
                  onValueChange={(value) =>
                    setFormData({ ...formData, network: value })
                  }
                >
                  <SelectTrigger id="network">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>USDT Networks</SelectLabel>
                      {USDT_NETWORKS.map((network) => (
                        <SelectItem key={network.value} value={network.value}>
                          {network.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="network"
                  value={formData.network}
                  readOnly
                  className="bg-muted"
                />
              )}
            </div>

            {/* Estimation Currency */}
            <div className="space-y-2">
              <Label htmlFor="estimation">Estimation Currency</Label>
              <Select
                value={formData.estimation}
                onValueChange={(value) =>
                  setFormData({ ...formData, estimation: value })
                }
              >
                <SelectTrigger id="estimation">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Currencies</SelectLabel>
                    {ESTIMATION_CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </div>

            {/* Charge */}
            <div className="space-y-2">
              <Label htmlFor="charge">Charge</Label>
              <Input
                id="charge"
                name="charge"
                type="number"
                placeholder="Enter charge"
                value={formData.charge}
                onChange={handleInputChange}
              />
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                name="bankName"
                placeholder="Enter bank name"
                value={formData.bankName}
                onChange={handleInputChange}
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={handleInputChange}
              />
            </div>

            {/* Customer Number */}
            <div className="space-y-2">
              <Label htmlFor="customerNumber">Customer Number</Label>
              <Input
                id="customerNumber"
                name="customerNumber"
                placeholder="Enter customer number"
                value={formData.customerNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600" type="submit">
            Submit Transaction
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
