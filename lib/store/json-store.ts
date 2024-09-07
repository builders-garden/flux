import { create } from "zustand";

type JsonStore = {
  json: any;
  set: (value: any) => void;
};

export const useJsonStore = create<JsonStore>((set) => ({
  json: null,
  set: (value) => set({ json: value }),
}));
