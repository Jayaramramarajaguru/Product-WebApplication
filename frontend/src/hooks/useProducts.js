import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  importProductsExcel,
} from "../api/productApi";

const PRODUCTS_KEY = ["products"];

// Query: get all products
export const useProductsQuery = () =>
  useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: fetchProducts,
  });

// Query: get single product (used for the View modal)
export const useProductQuery = (id, options = {}) =>
  useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    ...options,
  });

// Mutation: create product
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast.success("Product added successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add product");
    },
  });
};

// Mutation: update product
export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update product");
    },
  });
};

// Mutation: delete product
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete product");
    },
  });
};

// Mutation: bulk import from excel
export const useImportProductsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importProductsExcel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast.success(data?.message || "Products imported successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to import excel file");
    },
  });
};
