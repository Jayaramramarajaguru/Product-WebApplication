import { HiOutlineCube } from "react-icons/hi2";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-card">
            <HiOutlineCube className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900">
              Product Manager
            </h1>
            <p className="text-xs text-slate-400">Catalog &amp; inventory dashboard</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
