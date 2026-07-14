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
    <div className="flex items-center gap-3">
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
        className="btn-secondary cursor-pointer"
      >
        <HiOutlineDocumentArrowUp className="h-4 w-4" />
        {importMutation.isPending ? `Importing ${fileName}...` : "Import Excel"}
      </label>
    </div>
  );
};

export default ExcelUpload;
