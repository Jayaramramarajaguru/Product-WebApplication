# Product Manager — MERN Stack

A full MERN app to manage a product catalog: bulk-import an Excel sheet, view
products in a table, and edit/view/delete each one — including uploading or
**live camera capture** of the product image (works on phone, laptop, and
desktop browsers).

## Stack

- **Frontend:** React + Vite, Tailwind CSS, TanStack React Query, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), Multer, `xlsx`

## Folder structure

```
mern-product-app/
├── backend/
│   ├── config/db.js               MongoDB connection
│   ├── models/Product.js          Mongoose schema
│   ├── controllers/productController.js   CRUD + Excel import logic
│   ├── routes/productRoutes.js
│   ├── middleware/upload.js       multer config (images + excel)
│   ├── uploads/                   stored product images
│   └── server.js
└── frontend/
    └── src/
        ├── api/
        │   ├── axiosInstance.js   axios base config
        │   └── productApi.js     ALL raw API calls live here (no react-query)
        ├── hooks/
        │   └── useProducts.js     ALL react-query hooks (queries + mutations)
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ExcelUpload.jsx
        │   ├── ProductTable.jsx
        │   ├── ProductModal.jsx   create / edit / view form
        │   └── CameraCapture.jsx  device camera capture modal
        └── App.jsx                calls the react-query hooks only
```

This keeps a clean separation: **`api/` holds plain fetch functions**,
**`hooks/` wraps them with `useQuery`/`useMutation`**, and **components/pages
only ever call the hooks** — never axios directly.

## 1. Backend setup

```bash
cd backend
cp .env.example .env      # edit MONGO_URI if needed
npm install
npm run dev                # nodemon, http://localhost:5000
```

Make sure MongoDB is running locally (or point `MONGO_URI` at Atlas).

## 2. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

## 3. Import products from Excel

Click **Import Excel** and upload an `.xls`/`.xlsx` file with these columns
(header names are matched case-insensitively, a few synonyms are accepted):

| S.No | Name | MRP | Category | Description |
|------|------|-----|----------|-------------|

A ready-to-use sample file is in `sample-data/products_sample.xlsx`
(regenerate with `python3 sample-data/generate_sample_excel.py`).

Imported rows have no image — add one later via **Edit → Upload/Capture**.

## 4. Editing a product / image capture

- **View** opens a read-only modal (with an "Edit Product" shortcut).
- **Edit** lets you change every field, and either:
  - **Upload** an image file from disk, or
  - **Capture** — opens your camera (via `getUserMedia`), works on phones
    (with front/back camera flip), laptops with a webcam, and desktops with a
    connected camera. The captured photo is sent to the backend as a base64
    string and saved as a file on the server.
- **Delete** asks for confirmation, then removes the product and its image
  file from disk.

## API summary

| Method | Route                  | Purpose                          |
|--------|-------------------------|-----------------------------------|
| GET    | `/api/products`         | list all products                 |
| GET    | `/api/products/:id`     | get one product                   |
| POST   | `/api/products`         | create (multipart: image/capture) |
| PUT    | `/api/products/:id`     | update (multipart: image/capture) |
| DELETE | `/api/products/:id`     | delete                            |
| POST   | `/api/products/import`  | bulk import from Excel file       |

Images are served statically from `/uploads/<filename>`.
"# Product-WebApplication" 
