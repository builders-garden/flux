import { create } from "zustand";
import { Webhook } from "@prisma/client";

interface WebhooksStore {
  deleteWebhook: Webhook | null;
  updateWebhook: Webhook | null;
  setDeleteWebhook: (webhook: Webhook | null) => void;
  setUpdateWebhook: (webhook: Webhook | null) => void;
}

export const useWebhooksStore = create<WebhooksStore>((set) => ({
  deleteWebhook: null,
  updateWebhook: null,
  setDeleteWebhook: (webhook: Webhook | null) =>
    set({ deleteWebhook: webhook }),
  setUpdateWebhook: (webhook: Webhook | null) =>
    set({ updateWebhook: webhook }),
}));
