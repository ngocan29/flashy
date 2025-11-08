
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  price: number;
  price_sale?: number;
  image_url: string;
  creator_name: string;
  user_id: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    icon: 'ri-bank-line',
    description: 'Chuyển khoản trực tiếp đến tài khoản người bán'
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    icon: 'ri-smartphone-line',
    description: 'Thanh toán qua ví điện tử MoMo'
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    icon: 'ri-wallet-line',
    description: 'Thanh toán qua ví điện tử ZaloPay'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'ri-paypal-line',
    description: 'Thanh toán quốc tế qua PayPal'
  }
];

export default function CheckoutPage({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [error, setError] = useState<string>('');
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3006/api/products/${productId}`)
      if (!response.ok) {
        throw new Error('Product not found')
      }
      
      const data = await response.json()
      
      // Transform API data
      setProduct({
        id: data.id.toString(),
        title: data.title,
        price: data.price || 0,
        price_sale: data.saleprice > 0 ? data.saleprice : undefined,
        image_url: data.image || 'https://via.placeholder.com/400x300?text=No+Image',
        creator_name: data.seller_name || 'Unknown Creator',
        user_id: data.userid || 0
      })

      // Check if user already purchased
      if (user?.email) {
        const purchaseResponse = await fetch(`http://localhost:3006/api/payments/check?userEmail=${encodeURIComponent(user.email)}&productId=${productId}`)
        if (purchaseResponse.ok) {
          const purchaseData = await purchaseResponse.json()
          if (purchaseData.hasPurchased) {
            setHasPurchased(true)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Không thể tải thông tin sản phẩm')
    } finally {
      setLoading(false)
    }
  };

  const handlePayment = async () => {
    if (!user?.email) {
      alert('Vui lòng đăng nhập để thanh toán');
      return;
    }

    if (!selectedPayment) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }

    setProcessing(true);

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
      });

      if (response.ok) {
        alert('Thanh toán thành công! Bạn có thể tải xuống sản phẩm ngay bây giờ.');
        setHasPurchased(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!');
    } finally {
      setProcessing(false);
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để mua sản phẩm</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const finalPrice = product.price_sale || product.price;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline flex items-center">
            <i className="ri-arrow-left-line mr-2"></i>
            Quay lại trang chủ
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Thông tin sản phẩm */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Thông tin sản phẩm</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <img 
                    src={product.image_url} 
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Bởi {product.creator_name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {product.price_sale ? (
                        <>
                          <span className="font-bold text-xl text-gray-900">
                            ${product.price_sale}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            ${product.price}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-xl text-gray-900">
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin người bán */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Thông tin người bán</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.creator_name}</h3>
                      <p className="text-gray-600">ID: {product.user_id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Chọn phương thức thanh toán</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === method.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedPayment === method.id && (
                          <i className="ri-check-line text-white text-sm"></i>
                        )}
                      </div>
                      <i className={`${method.icon} text-xl text-gray-700`}></i>
                      <div>
                        <h3 className="font-semibold text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Thông tin thanh toán */}
              {selectedPayment && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Thông tin thanh toán cho người bán
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Người nhận:</strong> {product.creator_name}</p>
                    <p><strong>ID người bán:</strong> {product.user_id}</p>
                    <p><strong>Số tiền:</strong> ${finalPrice}</p>
                    <p><strong>Mã sản phẩm:</strong> {productId}</p>
                  </div>
                  <div className="mt-3 text-sm text-yellow-700">
                    <i className="ri-information-line mr-1"></i>
                    Vui lòng ghi rõ mã sản phẩm khi chuyển khoản để xác nhận thanh toán
                  </div>
                </div>
              )}

              {/* Tổng kết đơn hàng */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Tổng thanh toán:</span>
                  <span className="text-2xl text-pink-600">${finalPrice}</span>
                </div>
              </div>

              {/* Nút thanh toán */}
              <button
                onClick={handlePayment}
                disabled={!selectedPayment || processing}
                className="w-full mt-6 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
              >
                {processing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
