"use client";

import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from "@/state/api";
import Header from "@/app/(components)/Header";
import { useState, useEffect } from "react";
import { Plus, AlertTriangle, Star, Edit, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface FormData {
  productId: string;
  name: string;
  price: string;
  rating: string;
  stockQuantity: string;
}

interface FormErrors {
  [key: string]: string;
}

const Products = () => {
  const { data: products, isError, isLoading, refetch } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    productId: "",
    name: "",
    price: "",
    rating: "",
    stockQuantity: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchTerm(decodeURIComponent(query));
    }
  }, [searchParams]);

  const filteredProducts = products?.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];
  const lowStockCount = products?.filter((p) => p.stockQuantity < 10).length || 0;

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = "Product name is required";
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = "Price must be a positive number";
    if (formData.rating && parseFloat(formData.rating) < 0) errors.rating = "Rating cannot be negative";
    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) errors.stockQuantity = "Stock quantity must be a non-negative number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (isEditMode && editingProductId) {
        // Update product
        await updateProduct({
          productId: editingProductId,
          data: {
            name: formData.name,
            price: parseFloat(formData.price),
            rating: formData.rating ? parseFloat(formData.rating) : undefined,
            stockQuantity: parseInt(formData.stockQuantity),
          },
        }).unwrap();
        setFormErrors({ submit: "" });
      } else {
        // Create product
        await createProduct({
          name: formData.name,
          price: parseFloat(formData.price),
          rating: formData.rating ? parseFloat(formData.rating) : undefined,
          stockQuantity: parseInt(formData.stockQuantity),
        }).unwrap();
      }
      setFormData({ productId: "", name: "", price: "", rating: "", stockQuantity: "" });
      setFormErrors({});
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingProductId(null);
      refetch();
    } catch (error) {
      setFormErrors({ submit: isEditMode ? "Failed to update product. Please try again." : "Failed to create product. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProductId(product.productId);
    setFormData({
      productId: product.productId,
      name: product.name,
      price: product.price.toString(),
      rating: product.rating?.toString() || "",
      stockQuantity: product.stockQuantity.toString(),
    });
    setIsEditMode(true);
    setIsModalOpen(true);
    setFormErrors({});
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      setDeleteConfirm(null);
      refetch();
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingProductId(null);
    setFormData({ productId: "", name: "", price: "", rating: "", stockQuantity: "" });
    setFormErrors({});
  };

  const renderStars = (rating: number | undefined) => {
    if (!rating) return <span className="text-gray-400 text-sm">No rating</span>;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 text-gray-300"
          />
        );
      }
    }
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">{stars}</div>
        <span className="text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (isLoading) return <div className="py-8 text-center text-gray-500">Loading products...</div>;
  if (isError || !products) return <div className="text-center text-red-500 py-8">Failed to fetch products</div>;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input type="text" placeholder="Search products by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 flex items-center gap-2 whitespace-nowrap">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">{lowStockCount} low stock</span>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No products found</p>
          <p className="text-sm">Try adjusting your search or add a new product</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isLowStock = product.stockQuantity < 10;
            return (
              <div
                key={product.productId}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 flex flex-col"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
                  <img
                    src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {isLowStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Low Stock
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Product Name */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="mb-3">
                    {renderStars(product.rating)}
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Stock Quantity */}
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Stock:</span>
                    <span
                      className={`text-sm font-semibold ${
                        isLowStock ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {product.stockQuantity} {product.stockQuantity === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {/* Product ID Badge */}
                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      ID: {product.productId}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto pt-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.productId)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">{isEditMode ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">X</button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              {formErrors.submit && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{formErrors.submit}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`} placeholder="Product name" />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" min="0" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.price ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`} placeholder="0.00" />
                {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                <input type="number" name="rating" value={formData.rating} onChange={handleInputChange} step="0.1" min="0" max="5" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.rating ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`} placeholder="0.0" />
                {formErrors.rating && <p className="text-red-500 text-xs mt-1">{formErrors.rating}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} min="0" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.stockQuantity ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`} placeholder="0" />
                {formErrors.stockQuantity && <p className="text-red-500 text-xs mt-1">{formErrors.stockQuantity}</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">{isSubmitting ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Product" : "Add Product")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Delete Product?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteConfirm && handleDeleteProduct(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;