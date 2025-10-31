import { TransactionType } from "@/services/transactionService/transaction_types";
import { create } from "zustand";

type TransactionStore = {
  transaction: TransactionType | null;
  setTransaction: (data: TransactionType) => void;
  updateTransaction: (partial: Partial<TransactionType>) => void;
  resetTransaction: () => void;
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  transaction: null,
  setTransaction: (data) => set({ transaction: data }),
  updateTransaction: (partial) =>
    set((store) => ({
      transaction: { ...store.transaction, ...partial } as TransactionType,
    })),
  resetTransaction: () => set({ transaction: null }),
}));
