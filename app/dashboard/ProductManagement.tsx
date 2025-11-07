
'use client';

import { useState } from 'react';
import { mockProducts, mockCategories } from '@/lib/supabase';
import ProductForm from './ProductForm';

export default function ProductManagement() {
  const [products, setProducts] = useState(mockProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== productId));
      alert('Đã xóa sản phẩm thành công!');
    }
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      // Cập nhật sản phẩm
      setProducts(products.map(p =>
        p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p
      ));
      alert('Đã cập nhật sản phẩm thành công!');
    } else {
      // Thêm sản phẩm mới
      const newProduct = {
        ...productData,
        id: Date.now().toString(),
        user_id: 1 // Mock user ID
      };
      setProducts([newProduct, ...products]);
      alert('Đã thêm sản phẩm thành công!');
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap cursor-pointer"
        >
          Thêm sản phẩm
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Bởi {product.creator_name}
              </p>
              <div className="flex items-center mb-3">
                <div className="flex items-center text-yellow-500">
                  <i className="ri-star-fill text-sm"></i>
                  <span className="ml-1 text-sm font-medium text-gray-900">
                    {product.rate}
                  </span>
                </div>
                <span className="text-sm text-gray-500 ml-1">
                  ({product.rate_count})
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                {product.price_sale ? (
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg text-gray-900">
                      ${product.price_sale}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-lg text-gray-900">
                    ${product.price}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
