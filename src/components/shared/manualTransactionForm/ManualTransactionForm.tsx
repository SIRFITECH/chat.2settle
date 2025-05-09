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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DatePicker } from "./DatePicker";

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
    receiverAmount: "",
    currentRate: "",
    cryptoSent: "",
    merchantRate: "",
    profitRate: "",
    walletAddress: "",
    transactionDate: new Date(),
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

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    console.log("date", date);
    if (date) {
      // // Preserve the time from the current date
      const currentDate = formData.transactionDate;
      date.setHours(currentDate.getHours());
      date.setMinutes(currentDate.getMinutes());

      setFormData({
        ...formData,
        transactionDate: date,
      });
    }
  };

  // Handle time change
  const handleTimeChange = (hours: number, minutes: number) => {
    const newDate = new Date(formData.transactionDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);

    setFormData({
      ...formData,
      transactionDate: newDate,
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
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Crypto Transaction</CardTitle>
          <CardDescription>
            Enter the details for your crypto transaction
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Asset Selection */}
              <div className="space-y-2">
                <Label htmlFor="asset">Asset</Label>
                <Select
                  value={formData.asset}
                  onValueChange={handleAssetChange}
                >
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

              {/* Receiver Amount */}
              <div className="space-y-2">
                <Label htmlFor="receiverAmount">Receiver Amount</Label>
                <Input
                  id="receiverAmount"
                  name="receiverAmount"
                  type="number"
                  placeholder="Enter receiver amount"
                  value={formData.receiverAmount}
                  onChange={handleInputChange}
                />
              </div>

              {/* Current Rate */}
              <div className="space-y-2">
                <Label htmlFor="currentRate">Current Rate</Label>
                <Input
                  id="currentRate"
                  name="currentRate"
                  type="number"
                  placeholder="Enter current rate"
                  value={formData.currentRate}
                  onChange={handleInputChange}
                />
              </div>

              {/* Crypto Sent */}
              <div className="space-y-2">
                <Label htmlFor="cryptoSent">Crypto Sent</Label>
                <Input
                  id="cryptoSent"
                  name="cryptoSent"
                  type="number"
                  placeholder="Enter crypto amount sent"
                  value={formData.cryptoSent}
                  onChange={handleInputChange}
                />
              </div>

              {/* Merchant Rate */}
              <div className="space-y-2">
                <Label htmlFor="merchantRate">Merchant Rate</Label>
                <Input
                  id="merchantRate"
                  name="merchantRate"
                  type="number"
                  placeholder="Enter merchant rate"
                  value={formData.merchantRate}
                  onChange={handleInputChange}
                />
              </div>

              {/* Profit Rate */}
              <div className="space-y-2">
                <Label htmlFor="profitRate">Profit Rate</Label>
                <Input
                  id="profitRate"
                  name="profitRate"
                  type="number"
                  placeholder="Enter profit rate"
                  value={formData.profitRate}
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

              {/* Wallet Address */}
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  name="walletAddress"
                  placeholder="Enter wallet address"
                  value={formData.walletAddress}
                  onChange={handleInputChange}
                />
              </div>

              {/* Transaction Date */}
              <div className="space-y-2">
                <Label htmlFor="transactionDate">Transaction Date & Time</Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.transactionDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.transactionDate ? (
                          format(formData.transactionDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[9999]">
                      <div onClick={() => console.log("Calendar clicked")}>
                        <Calendar
                          mode="single"
                          selected={formData.transactionDate}
                          // onSelect={handleDateChange}
                          onSelect={(date) => {
                            console.log("Date selected:", date);
                            handleDateChange(date);
                          }}
                          initialFocus
                        />
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.transactionDate && "text-muted-foreground"
                        )}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {formData.transactionDate ? (
                          format(formData.transactionDate, "HH:mm")
                        ) : (
                          <span>Set time</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 z-[9999]">
                      <div className="space-y-2">
                        <div className="grid gap-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-1">
                              <Label htmlFor="hours">Hours</Label>
                              <Input
                                id="hours"
                                type="number"
                                min={0}
                                max={23}
                                value={formData.transactionDate.getHours()}
                                onChange={(e) =>
                                  handleTimeChange(
                                    Number.parseInt(e.target.value) || 0,
                                    formData.transactionDate.getMinutes()
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                            <div className="grid gap-1">
                              <Label htmlFor="minutes">Minutes</Label>
                              <Input
                                id="minutes"
                                type="number"
                                min={0}
                                max={59}
                                value={formData.transactionDate.getMinutes()}
                                onChange={(e) =>
                                  handleTimeChange(
                                    formData.transactionDate.getHours(),
                                    Number.parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
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
      <DatePicker />
    </>
  );
}

// "use client";

// import type React from "react";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "@/hooks/use-toast";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { CalendarIcon, Clock } from "lucide-react";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";

// // Define asset types and their default networks
// const ASSETS = [
//   { value: "BTC", label: "Bitcoin (BTC)", defaultNetwork: "BTC" },
//   { value: "ETH", label: "Ethereum (ETH)", defaultNetwork: "ERC20" },
//   { value: "BNB", label: "Binance Coin (BNB)", defaultNetwork: "BEP20" },
//   { value: "TRX", label: "TRON (TRX)", defaultNetwork: "TRC20" },
//   { value: "USDT-ERC20", label: "USDT (ERC20)", defaultNetwork: "ERC20" },
//   { value: "USDT-BEP20", label: "USDT (BEP20)", defaultNetwork: "BEP20" },
//   { value: "USDT-TRC20", label: "USDT (TRC20)", defaultNetwork: "TRC20" },
// ];

// // Define estimation currencies
// const ESTIMATION_CURRENCIES = [
//   { value: "naira", label: "Naira (₦)" },
//   { value: "dollar", label: "Dollar ($)" },
//   { value: "crypto", label: "Crypto" },
// ];

// // Define network options for USDT
// const USDT_NETWORKS = [
//   { value: "ERC20", label: "ERC20 (Ethereum)" },
//   { value: "BEP20", label: "BEP20 (Binance Smart Chain)" },
//   { value: "TRC20", label: "TRC20 (TRON)" },
// ];

// export default function CryptoTransactionForm({
//   onClose,
// }: {
//   onClose: () => void;
// }) {
//   // Form state
//   const [formData, setFormData] = useState({
//     asset: "",
//     network: "",
//     estimation: "naira",
//     amount: "",
//     charge: "",
//     bankName: "",
//     accountNumber: "",
//     customerNumber: "",
//     receiverAmount: "",
//     currentRate: "",
//     cryptoSent: "",
//     merchantRate: "",
//     profitRate: "",
//     walletAddress: "",
//   });

//   // Separate state for date and time to fix the popover issue
//   const [date, setDate] = useState<Date>(new Date());
//   const [hours, setHours] = useState<number>(new Date().getHours());
//   const [minutes, setMinutes] = useState<number>(new Date().getMinutes());

//   // Determine if the selected asset is USDT
//   const isUSDT = formData.asset.startsWith("USDT");

//   // Handle asset selection and auto-populate network
//   const handleAssetChange = (value: string) => {
//     const selectedAsset = ASSETS.find((asset) => asset.value === value);

//     setFormData({
//       ...formData,
//       asset: value,
//       // Auto-populate network based on asset selection
//       network: selectedAsset?.defaultNetwork || "",
//     });
//   };

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle date selection
//   const handleDateSelect = (selectedDate: Date | undefined) => {
//     if (selectedDate) {
//       setDate(selectedDate);
//     }
//   };

//   // Handle time changes
//   const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = Number.parseInt(e.target.value);
//     if (!isNaN(value) && value >= 0 && value <= 23) {
//       setHours(value);
//     }
//   };

//   const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = Number.parseInt(e.target.value);
//     if (!isNaN(value) && value >= 0 && value <= 59) {
//       setMinutes(value);
//     }
//   };

//   // Get the full date time for submission
//   const getDateTime = () => {
//     const dateTime = new Date(date);
//     dateTime.setHours(hours);
//     dateTime.setMinutes(minutes);
//     return dateTime;
//   };

//   // Handle form submission
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate form
//     if (
//       !formData.asset ||
//       !formData.network ||
//       !formData.amount ||
//       !formData.bankName ||
//       !formData.accountNumber ||
//       !formData.customerNumber ||
//       !formData.receiverAmount ||
//       !formData.currentRate ||
//       !formData.cryptoSent ||
//       !formData.walletAddress
//     ) {
//       toast({
//         title: "Error",
//         description: "Please fill in all required fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Get the full date time
//     const transactionDateTime = getDateTime();

//     // Create final data object with date and time
//     const finalData = {
//       ...formData,
//       transactionDateTime,
//     };

//     // Process form submission
//     console.log("Form submitted:", finalData);
//     toast({
//       title: "Success",
//       description: "Transaction details submitted successfully",
//     });

//     // Close the form
//     onClose();
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle>Crypto Transaction</CardTitle>
//         <CardDescription>
//           Enter the details for your crypto transaction
//         </CardDescription>
//       </CardHeader>
//       <form onSubmit={handleSubmit}>
//         <CardContent className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Asset Selection */}
//             <div className="space-y-2">
//               <Label htmlFor="asset">Asset</Label>
//               <Select value={formData.asset} onValueChange={handleAssetChange}>
//                 <SelectTrigger id="asset">
//                   <SelectValue placeholder="Select asset" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectLabel>Cryptocurrencies</SelectLabel>
//                     {ASSETS.map((asset) => (
//                       <SelectItem key={asset.value} value={asset.value}>
//                         {asset.label}
//                       </SelectItem>
//                     ))}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Network Selection */}
//             <div className="space-y-2">
//               <Label htmlFor="network">Network</Label>
//               {isUSDT ? (
//                 <Select
//                   value={formData.network}
//                   onValueChange={(value) =>
//                     setFormData({ ...formData, network: value })
//                   }
//                 >
//                   <SelectTrigger id="network">
//                     <SelectValue placeholder="Select network" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectLabel>USDT Networks</SelectLabel>
//                       {USDT_NETWORKS.map((network) => (
//                         <SelectItem key={network.value} value={network.value}>
//                           {network.label}
//                         </SelectItem>
//                       ))}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               ) : (
//                 <Input
//                   id="network"
//                   value={formData.network}
//                   readOnly
//                   className="bg-muted"
//                 />
//               )}
//             </div>

//             {/* Estimation Currency */}
//             <div className="space-y-2">
//               <Label htmlFor="estimation">Estimation Currency</Label>
//               <Select
//                 value={formData.estimation}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, estimation: value })
//                 }
//               >
//                 <SelectTrigger id="estimation">
//                   <SelectValue placeholder="Select currency" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectLabel>Currencies</SelectLabel>
//                     {ESTIMATION_CURRENCIES.map((currency) => (
//                       <SelectItem key={currency.value} value={currency.value}>
//                         {currency.label}
//                       </SelectItem>
//                     ))}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Amount */}
//             <div className="space-y-2">
//               <Label htmlFor="amount">Amount</Label>
//               <Input
//                 id="amount"
//                 name="amount"
//                 type="number"
//                 placeholder="Enter amount"
//                 value={formData.amount}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Receiver Amount */}
//             <div className="space-y-2">
//               <Label htmlFor="receiverAmount">Receiver Amount</Label>
//               <Input
//                 id="receiverAmount"
//                 name="receiverAmount"
//                 type="number"
//                 placeholder="Enter receiver amount"
//                 value={formData.receiverAmount}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Current Rate */}
//             <div className="space-y-2">
//               <Label htmlFor="currentRate">Current Rate</Label>
//               <Input
//                 id="currentRate"
//                 name="currentRate"
//                 type="number"
//                 placeholder="Enter current rate"
//                 value={formData.currentRate}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Crypto Sent */}
//             <div className="space-y-2">
//               <Label htmlFor="cryptoSent">Crypto Sent</Label>
//               <Input
//                 id="cryptoSent"
//                 name="cryptoSent"
//                 type="number"
//                 placeholder="Enter crypto amount sent"
//                 value={formData.cryptoSent}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Merchant Rate */}
//             <div className="space-y-2">
//               <Label htmlFor="merchantRate">Merchant Rate</Label>
//               <Input
//                 id="merchantRate"
//                 name="merchantRate"
//                 type="number"
//                 placeholder="Enter merchant rate"
//                 value={formData.merchantRate}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Profit Rate */}
//             <div className="space-y-2">
//               <Label htmlFor="profitRate">Profit Rate</Label>
//               <Input
//                 id="profitRate"
//                 name="profitRate"
//                 type="number"
//                 placeholder="Enter profit rate"
//                 value={formData.profitRate}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Charge */}
//             <div className="space-y-2">
//               <Label htmlFor="charge">Charge</Label>
//               <Input
//                 id="charge"
//                 name="charge"
//                 type="number"
//                 placeholder="Enter charge"
//                 value={formData.charge}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Wallet Address */}
//             <div className="space-y-2">
//               <Label htmlFor="walletAddress">Wallet Address</Label>
//               <Input
//                 id="walletAddress"
//                 name="walletAddress"
//                 placeholder="Enter wallet address"
//                 value={formData.walletAddress}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Transaction Date */}
//             <div className="space-y-2">
//               <Label>Transaction Date</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn(
//                       "w-full justify-start text-left font-normal",
//                       !date && "text-muted-foreground"
//                     )}
//                   >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {date ? format(date, "PPP") : <span>Pick a date</span>}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <Calendar
//                     mode="single"
//                     selected={date}
//                     onSelect={handleDateSelect}
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>

//             {/* Transaction Time */}
//             <div className="space-y-2">
//               <Label>Transaction Time</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn("w-full justify-start text-left font-normal")}
//                   >
//                     <Clock className="mr-2 h-4 w-4" />
//                     {`${hours.toString().padStart(2, "0")}:${minutes
//                       .toString()
//                       .padStart(2, "0")}`}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-4" align="start">
//                   <div className="grid gap-2">
//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="grid gap-1">
//                         <Label htmlFor="hours">Hours</Label>
//                         <Input
//                           id="hours"
//                           type="number"
//                           min={0}
//                           max={23}
//                           value={hours}
//                           onChange={handleHoursChange}
//                           className="w-full"
//                         />
//                       </div>
//                       <div className="grid gap-1">
//                         <Label htmlFor="minutes">Minutes</Label>
//                         <Input
//                           id="minutes"
//                           type="number"
//                           min={0}
//                           max={59}
//                           value={minutes}
//                           onChange={handleMinutesChange}
//                           className="w-full"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             </div>

//             {/* Bank Name */}
//             <div className="space-y-2">
//               <Label htmlFor="bankName">Bank Name</Label>
//               <Input
//                 id="bankName"
//                 name="bankName"
//                 placeholder="Enter bank name"
//                 value={formData.bankName}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Account Number */}
//             <div className="space-y-2">
//               <Label htmlFor="accountNumber">Account Number</Label>
//               <Input
//                 id="accountNumber"
//                 name="accountNumber"
//                 placeholder="Enter account number"
//                 value={formData.accountNumber}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Customer Number */}
//             <div className="space-y-2">
//               <Label htmlFor="customerNumber">Customer Number</Label>
//               <Input
//                 id="customerNumber"
//                 name="customerNumber"
//                 placeholder="Enter customer number"
//                 value={formData.customerNumber}
//                 onChange={handleInputChange}
//               />
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button type="button" variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button className="bg-blue-600" type="submit">
//             Submit Transaction
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// }
