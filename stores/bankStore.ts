import { UserBankData } from "@/types/general_types";
import { create } from "zustand";

type BankStoreType = {
  bankCodes: string[];
  bankNames: string[];
  selectedBankCode: string;
  selectedBankName: string;
  bankData: UserBankData[];

  setBankCodes: (codes: string[]) => void;
  setBankNames: (names: string[]) => void;
  setSelectedBankCode: (code: string) => void;
  setSelectedBankName: (name: string) => void;
  updateBankData: (data: Partial<UserBankData>) => void;
};

export const useBankStore = create<BankStoreType>((set) => ({
  bankCodes: [],
  bankNames: [],
  selectedBankCode: "",
  selectedBankName: "",
  bankData: [],

  setBankCodes: (codes) => set({ bankCodes: codes }),
  setBankNames: (names) => set({ bankNames: names }),
  setSelectedBankCode: (code) => set({ selectedBankCode: code }),
  setSelectedBankName: (name) => set({ selectedBankName: name }),
  updateBankData: (data) =>
    set((state) => ({
      bankData: { ...state.bankData, ...data },
    })),
  //   updateBankData: (data) => set({ bankData: data }),
}));
