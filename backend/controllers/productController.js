import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import Product from "../models/Product.js";

// Helper: convert a base64 data URL (from camera capture) into a saved file
const saveBase64Image = (base64String) => {
  const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) return null;

  const ext = matches[1].split("/")[1];
  const data = matches[2];
  const fileName = `capture-${Date.now()}.${ext}`;
  const uploadDir = path.resolve("uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, data, "base64");
  return fileName;
};

// @desc  Get all products
// @route GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ sNo: 1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single product
// @route GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a single product (with optional image file or base64 capture)
// @route POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { sNo, name, mrp, category, description, capturedImage } = req.body;

    let imagePath = "";
    if (req.file) {
      imagePath = req.file.filename;
    } else if (capturedImage) {
      const saved = saveBase64Image(capturedImage);
      if (saved) imagePath = saved;
    }

    const product = await Product.create({
      sNo,
      name,
      mrp,
      category,
      description,
      image: imagePath,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Update product (with optional new image file or base64 capture)
// @route PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { sNo, name, mrp, category, description, capturedImage, removeImage } =
      req.body;

    if (sNo !== undefined) product.sNo = sNo;
    if (name !== undefined) product.name = name;
    if (mrp !== undefined) product.mrp = mrp;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;

    const deleteOldImage = () => {
      if (product.image) {
        const oldPath = path.resolve("uploads", product.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    };

    if (req.file) {
      deleteOldImage();
      product.image = req.file.filename;
    } else if (capturedImage) {
      const saved = saveBase64Image(capturedImage);
      if (saved) {
        deleteOldImage();
        product.image = saved;
      }
    } else if (removeImage === "true") {
      deleteOldImage();
      product.image = "";
    }

    const updated = await product.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Delete product
// @route DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image) {
      const imgPath = path.resolve("uploads", product.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Bulk import products from an uploaded Excel sheet
// @route POST /api/products/import
// Expected columns (case-insensitive, flexible headers):
// S.No | Name | MRP | Category | Description
export const importProductsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No excel file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Excel sheet is empty" });
    }

    const normalizeKey = (key) => key.toString().trim().toLowerCase();

    const getField = (row, candidates) => {
      const keys = Object.keys(row);
      for (const key of keys) {
        if (candidates.includes(normalizeKey(key))) return row[key];
      }
      return "";
    };

    const productsToInsert = rows.map((row, index) => {
      const sNo = getField(row, ["s.no", "sno", "s no", "serial no", "serial number"]) || index + 1;
      const name = getField(row, ["name", "product name", "product"]);
      const mrp = getField(row, ["mrp", "price"]);
      const category = getField(row, ["category", "cat"]);
      const description = getField(row, ["description", "desc"]);

      return {
        sNo: Number(sNo) || index + 1,
        name: String(name || "").trim(),
        mrp: Number(mrp) || 0,
        category: String(category || "").trim(),
        description: String(description || "").trim(),
        image: "",
      };
    }).filter((p) => p.name); // skip fully empty rows

    const inserted = await Product.insertMany(productsToInsert);

    // clean up the temp excel file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: `${inserted.length} products imported successfully`,
      products: inserted,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(400).json({ message: error.message });
  }
};
