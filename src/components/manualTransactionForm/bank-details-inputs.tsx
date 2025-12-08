"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BankDetailsInputsProps {
  bankName: string;
  accountNumber: string;
  accountName: string;
  onBankNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  onAccountNameChange: (value: string) => void;
}

export function BankDetailsInputs({
  bankName,
  accountNumber,
  accountName,
  onBankNameChange,
  onAccountNumberChange,
  onAccountNameChange,
}: BankDetailsInputsProps) {
  return (
    <>
      {/* Bank Name */}
      <div className="space-y-2">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          name="bankName"
          placeholder="Enter bank name"
          value={bankName}
          onChange={(e) => onBankNameChange(e.target.value)}
        />
      </div>

      {/* Account Number */}
      <div className="space-y-2">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          name="accountNumber"
          placeholder="Enter account number"
          value={accountNumber}
          onChange={(e) => {
            // Validate account number (max 10 digits)
            if (e.target.value.length <= 10) {
              onAccountNumberChange(e.target.value);
            }
          }}
        />
      </div>

      {/* Account Name */}
      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name</Label>
        <Input
          id="accountName"
          name="accountName"
          placeholder="Enter account name"
          value={accountName}
          onChange={(e) => onAccountNameChange(e.target.value)}
        />
      </div>
    </>
  );
}
