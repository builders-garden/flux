import { create } from "zustand";
import { Product } from "@prisma/client";

interface ProductsStore {
  deleteProduct: Product | null;
  updateProduct: Product | null;
  setDeleteProduct: (product: Product | null) => void;
  setUpdateProduct: (product: Product | null) => void;
}

export const useProductsStore = create<ProductsStore>((set) => ({
  deleteProduct: null,
  updateProduct: null,
  setDeleteProduct: (product: Product | null) =>
    set({ deleteProduct: product }),
  setUpdateProduct: (product: Product | null) =>
    set({ updateProduct: product }),
}));
