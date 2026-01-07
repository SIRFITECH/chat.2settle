import { TransactionType } from "@/services/transactionService/transaction_types";
import { create } from "zustand";

type TransactionStore = {
  giftId: string;
  transaction: TransactionType | null;
  setTransaction: (data: TransactionType) => void;
  setGiftId: (val: string) => void;
  updateTransaction: (partial: Partial<TransactionType>) => void;
  resetTransaction: () => void;
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  giftId: '',
  transaction: null,
  setGiftId: (val) => set({ giftId: val}),
  setTransaction: (data) => set({ transaction: data }),
  updateTransaction: (partial) =>
    set((store) => ({
      transaction: { ...store.transaction, ...partial } as TransactionType,
    })),
  resetTransaction: () => set({ transaction: null }),
}));
