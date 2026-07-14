import { useState } from "react";
import {
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePhoto,
} from "react-icons/hi2";
import { useDeleteProductMutation } from "../hooks/useProducts";
import { UPLOADS_BASE_URL } from "../api/axiosInstance";

const ConfirmDeleteDialog = ({ productName, onCancel, onConfirm, isDeleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
      <h3 className="text-base font-bold text-slate-900">Delete product?</h3>
      <p className="mt-2 text-sm text-slate-500">
        This will permanently remove <span className="font-medium">{productName}</span>{" "}
        and its image.
      </p>
      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={isDeleting} className="btn-danger">
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

const ProductImage = ({ product, size = "h-11 w-11" }) => (
  <div className={`${size} shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50`}>
    {product.image ? (
      <img
        src={`${UPLOADS_BASE_URL}/${product.image}`}
        alt={product.name}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center">
        <HiOutlinePhoto className="h-5 w-5 text-slate-300" />
      </div>
    )}
  </div>
);

const RowActions = ({ product, onView, onEdit, onDelete, className = "" }) => (
  <div className={`flex items-center gap-1.5 ${className}`}>
    <button
      onClick={() => onView(product)}
      className="btn-icon text-slate-500 hover:bg-slate-100"
      title="View"
    >
      <HiOutlineEye className="h-4.5 w-4.5" />
    </button>
    <button
      onClick={() => onEdit(product)}
      className="btn-icon text-brand-600 hover:bg-brand-50"
      title="Edit"
    >
      <HiOutlinePencilSquare className="h-4.5 w-4.5" />
    </button>
    <button
      onClick={() => onDelete(product)}
      className="btn-icon text-red-500 hover:bg-red-50"
      title="Delete"
    >
      <HiOutlineTrash className="h-4.5 w-4.5" />
    </button>
  </div>
);

const ProductTable = ({ products, onView, onEdit }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const deleteMutation = useDeleteProductMutation();

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-16 text-center sm:py-20">
        <HiOutlinePhoto className="h-10 w-10 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-500">No products yet</p>
        <p className="text-xs text-slate-400">
          Import an Excel sheet or add a product to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop / tablet table view */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["S.No", "Image", "Name", "Category", "MRP", "Description", "Actions"].map(
                  (head) => (
                    <th
                      key={head}
                      className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product._id} className="transition-colors hover:bg-slate-50/70">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {product.sNo}
                  </td>
                  <td className="px-4 py-3">
                    <ProductImage product={product} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">
                    {product.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-800">
                    ₹{Number(product.mrp).toLocaleString("en-IN")}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-500">
                    {product.description || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <RowActions
                      product={product}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={setDeleteTarget}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="flex flex-col gap-3 md:hidden">
        {products.map((product) => (
          <div
            key={product._id}
            className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-card"
          >
            <div className="flex items-start gap-3">
              <ProductImage product={product} size="h-16 w-16" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-400">S.No {product.sNo}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-slate-800">
                    ₹{Number(product.mrp).toLocaleString("en-IN")}
                  </p>
                </div>
                <span className="mt-1.5 inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                  {product.category}
                </span>
                {product.description && (
                  <p className="mt-1.5 line-clamp-2 text-xs text-slate-500">
                    {product.description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-1.5 border-t border-slate-100 pt-2.5">
              <RowActions
                product={product}
                onView={onView}
                onEdit={onEdit}
                onDelete={setDeleteTarget}
              />
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <ConfirmDeleteDialog
          productName={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </>
  );
};

export default ProductTable;