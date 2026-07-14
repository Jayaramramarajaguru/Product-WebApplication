import { HiOutlineCube } from "react-icons/hi2";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-card sm:h-9 sm:w-9">
            <HiOutlineCube className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-slate-900 sm:text-lg">
              Product Manager
            </h1>
            <p className="hidden text-xs text-slate-400 sm:block">
              Catalog &amp; inventory dashboard
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;