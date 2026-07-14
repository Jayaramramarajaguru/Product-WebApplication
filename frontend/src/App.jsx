import { useMemo, useState } from "react";
import { HiOutlinePlus, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import Navbar from "./components/Navbar";
import ExcelUpload from "./components/ExcelUpload";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import { useProductsQuery } from "./hooks/useProducts";

function App() {
  const { data: products = [], isLoading, isError, error } = useProductsQuery();

  const [search, setSearch] = useState("");
  const [modalState, setModalState] = useState({ open: false, mode: "create", product: null });

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const openCreate = () => setModalState({ open: true, mode: "create", product: null });
  const openView = (product) => setModalState({ open: true, mode: "view", product });
  const openEdit = (product) => setModalState({ open: true, mode: "edit", product });
  const closeModal = () => setModalState({ open: false, mode: "create", product: null });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Products</h2>
            <p className="text-sm text-slate-500">
              {products.length} product{products.length !== 1 ? "s" : ""} in catalog
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full sm:w-64">
              <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input w-full pl-10"
              />
            </div>
            <div className="flex gap-3">
              <ExcelUpload />
              <button onClick={openCreate} className="btn-primary flex-1 sm:flex-none">
                <HiOutlinePlus className="h-4 w-4" />
                <span className="sm:inline">Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 sm:py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            Failed to load products: {error?.message}
          </div>
        )}

        {!isLoading && !isError && (
          <ProductTable products={filteredProducts} onView={openView} onEdit={openEdit} />
        )}
      </main>

      {modalState.open && (
        <ProductModal
          mode={modalState.mode}
          product={modalState.product}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;