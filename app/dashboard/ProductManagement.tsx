
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import ProductForm from './ProductForm';

interface Product {
  id: string;
  title: string;
  description: string[];
  price: number;
  price_sale?: number;
  image_url: string;
  video_url?: string;
  creator_name: string;
  rate: number;
  rate_count: number;
  permit: string;
  permit_life: number | null;
  user_id: number;
}

export default function ProductManagement() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProducts();
    }
  }, [user]);

  const fetchUserProducts = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3006/api/products?userEmail=${encodeURIComponent(user.email)}`);
      if (response.ok) {
        const data = await response.json();
        
        // Transform API data to match frontend interface
        const transformedProducts = data.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          description: typeof item.description === 'string' ? JSON.parse(item.description || '[]') : (item.description || []),
          price: item.price || 0,
          price_sale: item.saleprice > 0 ? item.saleprice : undefined,
          image_url: item.image || 'https://via.placeholder.com/400x300?text=No+Image',
          video_url: item.videodemo || undefined,
          creator_name: item.seller_name || 'Unknown Creator',
          rate: item.rateavg || 0,
          rate_count: item.ratecount || 0,
          permit: item.islicense === 'yes' ? 'License' : 'Free',
          permit_life: item.licenseday ? Math.floor(item.licenseday / 30) : 0,
          user_id: item.userid || 0
        }));
        
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Error fetching user products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      const response = await fetch(`http://localhost:3006/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        alert('Đã xóa sản phẩm thành công!');
      } else {
        const errorData = await response.json();
        alert(`Lỗi khi xóa sản phẩm: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm!');
    }
  };

  const handleSaveProduct = (productData: any) => {
    // Refresh the products list after save
    fetchUserProducts();
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-3 w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <i className="ri-product-hunt-line text-4xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sản phẩm nào</h3>
          <p className="text-gray-500 mb-4">Tạo sản phẩm đầu tiên để bắt đầu bán hàng</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Tạo sản phẩm đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
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
      )}
    </div>
  );
}
