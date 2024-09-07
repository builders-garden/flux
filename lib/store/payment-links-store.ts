import { create } from "zustand";
import { PaymentLink } from "@prisma/client";

interface PaymentLinksStore {
  deletePaymentLink: PaymentLink | null;
  updatePaymentLink: PaymentLink | null;
  setDeletePaymentLink: (PaymentLink: PaymentLink | null) => void;
  setUpdatePaymentLink: (PaymentLink: PaymentLink | null) => void;
}

export const usePaymentLinksStore = create<PaymentLinksStore>((set) => ({
  deletePaymentLink: null,
  updatePaymentLink: null,
  setDeletePaymentLink: (PaymentLink: PaymentLink | null) =>
    set({ deletePaymentLink: PaymentLink }),
  setUpdatePaymentLink: (PaymentLink: PaymentLink | null) =>
    set({ updatePaymentLink: PaymentLink }),
}));
