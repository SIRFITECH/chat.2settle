import { create } from "zustand";

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: React.ReactNode | null;
  isConfirming: boolean;
  hasConfirmed: boolean;
  onConfirm?: () => Promise<void> | void;

  open: (config: {
    title: string;
    description: React.ReactNode;
    onConfirm: () => Promise<void> | void;
  }) => void;

  close: () => void;
  confirm: () => Promise<void>;
}

export const useConfirmDialogStore = create<ConfirmDialogState>((set, get) => ({
  isOpen: false,
  title: "",
  description: null,
  isConfirming: false,
  hasConfirmed: false,

  open: ({ title, description, onConfirm }) =>
    set({
      isOpen: true,
      title,
      description,
      onConfirm,
      isConfirming: false,
      hasConfirmed: false,
    }),

  close: () =>
    set({
      isOpen: false,
      isConfirming: false,
      hasConfirmed: false,
      onConfirm: undefined,
    }),

  confirm: async () => {
    const { onConfirm, hasConfirmed, isConfirming, close } = get();

    if (!onConfirm || hasConfirmed || isConfirming) return;

    try {
      set({ isConfirming: true, hasConfirmed: true });
      await onConfirm();
      close();
    } catch (err) {
      console.error("Confirmation failed:", err);
      set({ hasConfirmed: false });
    } finally {
      set({ isConfirming: false });
    }
  },
}));
