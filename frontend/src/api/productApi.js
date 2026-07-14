import axiosInstance from "./axiosInstance";

// Fetch all products
export const fetchProducts = async () => {
  const { data } = await axiosInstance.get("/products");
  return data;
};

// Fetch single product by id
export const fetchProductById = async (id) => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
};

// Build FormData from a product payload (handles file OR base64 capture)
const buildProductFormData = (product) => {
  const formData = new FormData();
  formData.append("sNo", product.sNo ?? "");
  formData.append("name", product.name ?? "");
  formData.append("mrp", product.mrp ?? "");
  formData.append("category", product.category ?? "");
  formData.append("description", product.description ?? "");

  if (product.imageFile) {
    formData.append("image", product.imageFile);
  } else if (product.capturedImage) {
    formData.append("capturedImage", product.capturedImage);
  }

  if (product.removeImage) {
    formData.append("removeImage", "true");
  }

  return formData;
};

// Create a new product
export const createProduct = async (product) => {
  const formData = buildProductFormData(product);
  const { data } = await axiosInstance.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Update an existing product
export const updateProduct = async ({ id, product }) => {
  const formData = buildProductFormData(product);
  const { data } = await axiosInstance.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Delete a product
export const deleteProduct = async (id) => {
  const { data } = await axiosInstance.delete(`/products/${id}`);
  return data;
};

// Bulk import products from an Excel file
export const importProductsExcel = async (file) => {
  const formData = new FormData();
  formData.append("excel", file);
  const { data } = await axiosInstance.post("/products/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
