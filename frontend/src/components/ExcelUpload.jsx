import { useRef, useState } from "react";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { useImportProductsMutation } from "../hooks/useProducts";

const ExcelUpload = () => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const importMutation = useImportProductsMutation();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    importMutation.mutate(file, {
      onSettled: () => {
        setFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  return (
    <div className="flex flex-1 items-center gap-3 sm:flex-none">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
        className="hidden"
        id="excel-upload-input"
      />
      <label
        htmlFor="excel-upload-input"
        className="btn-secondary w-full cursor-pointer whitespace-nowrap sm:w-auto"
      >
        <HiOutlineDocumentArrowUp className="h-4 w-4 shrink-0" />
        <span className="truncate">
          {importMutation.isPending ? `Importing...` : "Import Excel"}
        </span>
      </label>
    </div>
  );
};

export default ExcelUpload;