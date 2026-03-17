"use client";

import { useGetProductsQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useState, useMemo } from "react";
import { AlertTriangle } from "lucide-react";

const columns: GridColDef[] = [
  { field: "productId", headerName: "ID", width: 100, filterable: true, sortable: true },
  {
    field: "name",
    headerName: "Product Name",
    width: 250,
    filterable: true,
    sortable: true
  },
  {
    field: "price",
    headerName: "Price",
    width: 120,
    type: "number",
    filterable: true,
    sortable: true,
    valueGetter: (value, row) => `$${row.price.toFixed(2)}`,
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 100,
    type: "number",
    filterable: true,
    sortable: true,
    valueGetter: (value, row) => (row.rating ? row.rating.toFixed(2) : "N/A"),
  },
  {
    field: "stockQuantity",
    headerName: "Stock Quantity",
    width: 150,
    type: "number",
    filterable: true,
    sortable: true,
    renderCell: (params) => {
      const stock = params.value as number;
      const isLowStock = stock < 10;
      return (
        <div className="flex items-center gap-2">
          {isLowStock && <AlertTriangle className="w-4 h-4 text-red-500" />}
          <span className={isLowStock ? "text-red-600 font-semibold" : ""}>
            {stock}
          </span>
          {isLowStock && (
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              Low Stock
            </span>
          )}
        </div>
      );
    },
  },
];

const Inventory = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchTerm.trim()) return products;

    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const lowStockCount = useMemo(() => {
    return products?.filter((p) => p.stockQuantity < 10).length || 0;
  }, [products]);

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <Header name="Inventory" />
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">
            {lowStockCount} items low on stock
          </span>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by product name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* DATA GRID WITH TOOLBAR */}
      <DataGrid
        rows={filteredProducts}
        columns={columns}
        getRowId={(row) => row.productId}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            csvOptions: { fileName: `inventory-${new Date().toISOString().split("T")[0]}` },
            printOptions: { hideFooter: true, hideToolbar: true },
          },
        }}
        className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700"
        sx={{
          "& .MuiDataGrid-cell": {
            fontSize: "0.875rem",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#f9fafb",
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
      />
    </div>
  );
};

export default Inventory;
