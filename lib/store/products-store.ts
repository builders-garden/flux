import { create } from "zustand";
import { Product } from "@prisma/client";

interface ProductsStore {
  products: Product[];
  deleteProduct: Product | null;
  updateProduct: Product | null;
  setProducts: (products: Product[]) => void;
  setDeleteProduct: (product: Product | null) => void;
  setUpdateProduct: (product: Product | null) => void;
}

export const useProductsStore = create<ProductsStore>((set) => ({
  products: [],
  deleteProduct: null,
  updateProduct: null,
  setProducts: (products: Product[]) => set({ products }),
  setDeleteProduct: (product: Product | null) =>
    set({ deleteProduct: product }),
  setUpdateProduct: (product: Product | null) =>
    set({ updateProduct: product }),
}));
