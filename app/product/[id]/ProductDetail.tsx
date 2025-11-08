
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  description: string[];
  price: number;
  price_sale?: number;
  image_url: string;
  video_url: string;
  download_url: string;
  creator_name: string;
  rate: number;
  rate_count: number;
  permit: string;
  permit_life: number;
  view_count: number;
  user_id?: number;
}

export default function ProductDetail({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
    if (user) {
      checkPurchaseStatus();
    }
  }, [productId, user]);

  const fetchProduct = async () => {
    try {
      // Fetch product from API
      const response = await fetch(`http://localhost:3006/api/products/${productId}`)
      if (!response.ok) {
        if (response.status === 404) {
          setProduct(null)
          return
        }
        throw new Error('Failed to fetch product')
      }

      const data = await response.json()

      if (data) {
        // Transform API data to match frontend interface
        const transformedProduct = {
          id: data.id.toString(),
          title: data.title,
          description: typeof data.description === 'string' ? JSON.parse(data.description || '[]') : (data.description || []),
          price: data.price || 0,
          price_sale: data.saleprice > 0 ? data.saleprice : undefined,
          image_url: data.image || 'https://via.placeholder.com/400x300?text=No+Image',
          video_url: data.videodemo || '',
          download_url: data.download || '',
          creator_name: data.seller_name || 'Unknown Creator',
          rate: data.rateavg || 0,
          rate_count: data.ratecount || 0,
          permit: data.islicense === 'yes' ? 'License' : 'Free',
          permit_life: data.licenseday ? Math.floor(data.licenseday / 30) : 0,
          view_count: data.viewcount || 0
        }

        setProduct(transformedProduct)

        // Update view count
        await fetch(`http://localhost:3006/api/products/${productId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            viewcount: (data.viewcount || 0) + 1
          })
        })

        // Fetch related products from same creator
        try {
          const relatedResponse = await fetch(`http://localhost:3006/api/products?creator=${encodeURIComponent(data.seller_name || '')}`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            const relatedProducts = relatedData
              .filter((item: any) => item.id.toString() !== productId)
              .slice(0, 4)
              .map((item: any) => ({
                id: item.id.toString(),
                title: item.title,
                creator_name: item.seller_name || 'Unknown Creator',
                rate: item.rateavg || 0,
                rate_count: item.ratecount || 0,
                price: item.price || 0,
                price_sale: item.saleprice > 0 ? item.saleprice : undefined,
                image_url: item.image || 'https://via.placeholder.com/400x300?text=No+Image',
                video_url: item.videodemo || undefined,
                description: typeof item.description === 'string' ? JSON.parse(item.description || '[]') : (item.description || []),
                permit: item.islicense === 'yes' ? 'License' : 'Free',
                permit_life: item.licenseday ? Math.floor(item.licenseday / 30) : 0,
                category_id: item.categoryid?.toString() || 'all',
                user_id: item.userid || 0
              }))
            setRelatedProducts(relatedProducts)
          }
        } catch (error) {
          console.error('Error fetching related products:', error)
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkPurchaseStatus = async () => {
    if (!user?.email) return;

    try {
      const response = await fetch(`http://localhost:3006/api/payments/check?userEmail=${encodeURIComponent(user.email)}&productId=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setHasPurchased(data.hasPurchased || false)
      }
    } catch (error) {
      console.error('Error checking purchase status:', error)
    }
  }

  const handlePurchase = async () => {
    if (!user?.email) {
      alert('Vui lòng đăng nhập để mua sản phẩm');
      return;
    }

    try {
      const response = await fetch('http://localhost:3006/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          productId: productId,
          amount: product?.price_sale || product?.price,
          status: 'completed'
        })
      })

      if (response.ok) {
        alert('Mua thành công!');
        setHasPurchased(true);
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Payment failed')
      }
    } catch (error) {
      console.error('Error processing purchase:', error);
      alert('Có lỗi xảy ra khi thanh toán');
    }
  };

  const handleDownload = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để tải xuống');
      return;
    }

    if (!hasPurchased) {
      alert('Bạn cần mua sản phẩm trước khi tải xuống');
      return;
    }

    if (product?.download_url) {
      window.open(product.download_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
          <Link href="/" className="text-blue-600 hover:underline">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div>
              {product.video_url ? (
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video 
                    controls 
                    className="w-full h-full object-cover"
                    poster={product.image_url}
                  >
                    <source src={product.video_url} type="video/mp4" />
                    Trình duyệt không hỗ trợ video.
                  </video>
                </div>
              ) : (
                <img 
                  src={product.image_url} 
                  alt={product.title}
                  className="w-full aspect-video object-cover rounded-lg"
                />
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                <p className="text-gray-600">
                  Bởi <span className="font-semibold">{product.creator_name}</span>
                </p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-yellow-500">
                    <i className="ri-star-fill"></i>
                    <span className="ml-1 text-gray-900 font-semibold">
                      {product.rate}
                    </span>
                  </div>
                  <span className="text-gray-500 ml-2">({product.rate_count} đánh giá)</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Mô tả sản phẩm</h3>
                <ul className="space-y-2">
                  {product.description.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <i className="ri-check-line text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {product.price_sale ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.price_sale}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ${product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-semibold">Thời hạn:</span> {product.permit_life} tháng
                  </div>
                  <div>
                    <span className="font-semibold">Giấy phép:</span> {product.permit}
                  </div>
                </div>

                <div className="flex space-x-4">
                  {!hasPurchased ? (
                    <button
                      onClick={handlePurchase}
                      disabled={!user}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {user ? 'Mua ngay' : 'Đăng nhập để mua'}
                    </button>
                  ) : (
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Tải xuống
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Sản phẩm khác của {product.creator_name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={{
                    ...relatedProduct,
                    user_id: relatedProduct.user_id || 0
                  }} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
