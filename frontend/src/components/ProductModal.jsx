import { useEffect, useState } from "react";
import {
  HiOutlineXMark,
  HiOutlineCamera,
  HiOutlinePhoto,
  HiOutlineTrash,
} from "react-icons/hi2";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../hooks/useProducts";
import { UPLOADS_BASE_URL } from "../api/axiosInstance";
import CameraCapture from "./CameraCapture";

const emptyForm = {
  sNo: "",
  name: "",
  mrp: "",
  category: "",
  description: "",
};

// Fullscreen lightbox to preview the uploaded/captured image at full size
const ImageLightbox = ({ src, onClose }) => (
  <div
    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
    onClick={onClose}
  >
    <button
      onClick={onClose}
      className="btn-icon absolute right-4 top-4 bg-white/10 text-white hover:bg-white/20"
    >
      <HiOutlineXMark className="h-6 w-6" />
    </button>
    <img
      src={src}
      alt="Full preview"
      onClick={(e) => e.stopPropagation()}
      className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
    />
  </div>
);

// mode: "create" | "edit" | "view"
const ProductModal = ({ mode, product, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();

  const isViewOnly = mode === "view";

  useEffect(() => {
    if (product) {
      setForm({
        sNo: product.sNo ?? "",
        name: product.name ?? "",
        mrp: product.mrp ?? "",
        category: product.category ?? "",
        description: product.description ?? "",
      });
      setImagePreview(product.image ? `${UPLOADS_BASE_URL}/${product.image}` : "");
    } else {
      setForm(emptyForm);
      setImagePreview("");
    }
    setImageFile(null);
    setCapturedImage("");
    setRemoveImage(false);
  }, [product, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setCapturedImage("");
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCaptured = (dataUrl) => {
    setCapturedImage(dataUrl);
    setImageFile(null);
    setRemoveImage(false);
    setImagePreview(dataUrl);
    setShowCamera(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setCapturedImage("");
    setImagePreview("");
    setRemoveImage(true);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      imageFile,
      capturedImage,
      removeImage,
    };

    if (mode === "create") {
      createMutation.mutate(payload, {
        onSuccess: () => onClose(),
      });
    } else {
      updateMutation.mutate(
        { id: product._id, product: payload },
        { onSuccess: () => onClose() }
      );
    }
  };

  const title =
    mode === "create" ? "Add New Product" : isViewOnly ? "Product Details" : "Edit Product";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-0 sm:p-4">
      <div className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3.5 sm:px-6 sm:py-4">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="btn-icon text-slate-400 hover:bg-slate-100">
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-5 px-4 py-5 sm:px-6">
          {/* Image section */}
          <div>
            <span className="label">Product Image</span>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => imagePreview && setShowLightbox(true)}
                disabled={!imagePreview}
                className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 disabled:cursor-default"
                title={imagePreview ? "Click to view full size" : ""}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product"
                    className="h-full w-full cursor-zoom-in object-cover"
                  />
                ) : (
                  <HiOutlinePhoto className="h-8 w-8 text-slate-300" />
                )}
              </button>

              {!isViewOnly && (
                <div className="flex flex-1 flex-wrap gap-2">
                  <label className="btn-secondary cursor-pointer">
                    <HiOutlinePhoto className="h-4 w-4" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="btn-secondary"
                  >
                    <HiOutlineCamera className="h-4 w-4" />
                    Capture
                  </button>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn-danger"
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">S.No</label>
              <input
                type="number"
                name="sNo"
                value={form.sNo}
                onChange={handleChange}
                disabled={isViewOnly}
                required
                className="input"
              />
            </div>
            <div>
              <label className="label">MRP (₹)</label>
              <input
                type="number"
                step="0.01"
                name="mrp"
                value={form.mrp}
                onChange={handleChange}
                disabled={isViewOnly}
                required
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isViewOnly}
              required
              className="input"
            />
          </div>

          <div>
            <label className="label">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={isViewOnly}
              required
              className="input"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isViewOnly}
              rows={3}
              className="input resize-none"
            />
          </div>

          <div className="sticky bottom-0 -mx-4 flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-4 pb-4 pt-4 sm:static sm:mx-0 sm:flex-row sm:justify-end sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-2">
            {isViewOnly ? (
              <button type="button" onClick={onClose} className="btn-secondary">
                Close
              </button>
            ) : (
              <>
                <button type="button" onClick={onClose} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting
                    ? "Saving..."
                    : mode === "create"
                    ? "Add Product"
                    : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {showCamera && (
        <CameraCapture onCapture={handleCaptured} onClose={() => setShowCamera(false)} />
      )}

      {showLightbox && imagePreview && (
        <ImageLightbox src={imagePreview} onClose={() => setShowLightbox(false)} />
      )}
    </div>
  );
};

export default ProductModal;