import { BankName, UserBankData } from "@/types/general_types";
import { create } from "zustand";

type BankStoreType = {
  bankCodes: string[];
  bankNames: string[];
  bankList: string[];
  selectedBankCode: string;
  selectedBankName: string;
  bankData: UserBankData[];

  setBankCodes: (codes: string[]) => void;
  setBankNames: (names: string[]) => void;
  setBankList: (banks: string[]) => void;
  setSelectedBankCode: (code: string) => void;
  setSelectedBankName: (name: string) => void;
  updateBankData: (data: Partial<UserBankData>) => void;
};

export const useBankStore = create<BankStoreType>((set) => ({
  bankCodes: [],
  bankNames: [], // list of bank names eg ["Opay", "Palmpay"]
  // I may not need the variables above afterall
  bankList: [], // list of banks and their codes eg ["1. Opay 1234", "2. Palmpay 456"]
  selectedBankCode: "",
  selectedBankName: "",
  bankData: [],

  setBankCodes: (codes) => set({ bankCodes: codes }),
  setBankNames: (names) => set({ bankNames: names }),
  setBankList: (banks) => set({ bankList: banks }),
  setSelectedBankCode: (code) => set({ selectedBankCode: code }),
  setSelectedBankName: (name) => set({ selectedBankName: name }),
  updateBankData: (data) =>
    set((state) => ({
      bankData: { ...state.bankData, ...data },
    })),
  //   updateBankData: (data) => set({ bankData: data }),
}));
