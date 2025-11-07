
'use client';

import { useState, useEffect } from 'react';

interface Purchase {
  id: string;
  product_id: string;
  product_title: string;
  product_image: string;
  creator_name: string;
  price: number;
  status: 'completed' | 'pending';
  payment_method: string;
  purchase_date: string;
  download_count: number;
  max_downloads: number;
}

interface PurchasedProductsProps {
  activeTab: string;
}

// Mock data
const mockPurchases: Purchase[] = [
  {
    id: '1',
    product_id: '1',
    product_title: 'Website Template Modern Business',
    product_image: 'https://readdy.ai/api/search-image?query=modern%20business%20website%20template%20with%20clean%20design%2C%20professional%20layout%2C%20blue%20and%20white%20color%20scheme%2C%20corporate%20style%2C%20responsive%20design&width=400&height=300&seq=1&orientation=landscape',
    creator_name: 'WebDesign Pro',
    price: 49,
    status: 'completed',
    payment_method: 'Chuyển khoản ngân hàng',
    purchase_date: '2024-01-15',
    download_count: 2,
    max_downloads: 5
  },
  {
    id: '2',
    product_id: '2',
    product_title: 'Mobile App UI Kit Premium',
    product_image: 'https://readdy.ai/api/search-image?query=mobile%20app%20ui%20kit%20design%20with%20modern%20interface%20elements%2C%20colorful%20buttons%2C%20clean%20layouts%2C%20ios%20android%20style%20components&width=400&height=300&seq=2&orientation=landscape',
    creator_name: 'UI Master',
    price: 79,
    status: 'pending',
    payment_method: 'MoMo',
    purchase_date: '2024-01-20',
    download_count: 0,
    max_downloads: 3
  },
  {
    id: '3',
    product_id: '3',
    product_title: 'Excel Advanced Data Analysis Plugin',
    product_image: 'https://readdy.ai/api/search-image?query=excel%20spreadsheet%20with%20advanced%20data%20analysis%20charts%2C%20graphs%2C%20pivot%20tables%2C%20professional%20business%20analytics%20dashboard&width=400&height=300&seq=3&orientation=landscape',
    creator_name: 'Excel Expert',
    price: 35,
    status: 'completed',
    payment_method: 'PayPal',
    purchase_date: '2024-01-10',
    download_count: 1,
    max_downloads: 10
  },
  {
    id: '4',
    product_id: '4',
    product_title: 'E-commerce Dashboard Template',
    product_image: 'https://readdy.ai/api/search-image?query=ecommerce%20dashboard%20interface%20with%20sales%20charts%2C%20product%20management%2C%20order%20tracking%2C%20modern%20admin%20panel%20design&width=400&height=300&seq=4&orientation=landscape',
    creator_name: 'Dashboard Pro',
    price: 65,
    status: 'pending',
    payment_method: 'ZaloPay',
    purchase_date: '2024-01-22',
    download_count: 0,
    max_downloads: 5
  }
];

export default function PurchasedProducts({ activeTab }: PurchasedProductsProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, [activeTab]);

  const fetchPurchases = async () => {
    setLoading(true);
    
    // Mock delay
    setTimeout(() => {
      let filteredPurchases = mockPurchases;
      
      if (activeTab === 'purchased') {
        filteredPurchases = mockPurchases.filter(p => p.status === 'completed');
      } else if (activeTab === 'pending') {
        filteredPurchases = mockPurchases.filter(p => p.status === 'pending');
      }
      
      setPurchases(filteredPurchases);
      setLoading(false);
    }, 500);
  };

  const handleDownload = (purchase: Purchase) => {
    if (purchase.status === 'completed' && purchase.download_count < purchase.max_downloads) {
      alert(`Tải xuống: ${purchase.product_title}`);
      // Update download count
      setPurchases(prev => prev.map(p => 
        p.id === purchase.id 
          ? { ...p, download_count: p.download_count + 1 }
          : p
      ));
    }
  };

  const handleContinuePayment = (purchase: Purchase) => {
    alert(`Tiếp tục thanh toán cho: ${purchase.product_title}`);
  };

  const handleCancelOrder = (purchaseId: string) => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      setPurchases(prev => prev.filter(p => p.id !== purchaseId));
      alert('Đã hủy đơn hàng thành công');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
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
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <i className="ri-shopping-bag-line text-4xl text-gray-400"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {activeTab === 'purchased' ? 'Chưa có sản phẩm nào' : 'Không có đơn hàng chờ thanh toán'}
        </h3>
        <p className="text-gray-500">
          {activeTab === 'purchased' 
            ? 'Bạn chưa mua sản phẩm nào. Hãy khám phá marketplace để tìm sản phẩm phù hợp!'
            : 'Tất cả đơn hàng đã được thanh toán thành công.'
          }
        </p>
      </div>
    );
  }

  const purchasedProducts = purchases.filter(p => p.status === 'completed');
  const pendingProducts = purchases.filter(p => p.status === 'pending');

  return (
    <div className="space-y-6">
      {activeTab === 'purchased' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm đã mua ({purchasedProducts.length})</h2>
          {purchasedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <i className="ri-shopping-bag-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sản phẩm nào</h3>
              <p className="text-gray-500">Bạn chưa mua sản phẩm nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {purchasedProducts.map((purchase) => (
                <div key={purchase.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img
                      src={purchase.product_image}
                      alt={purchase.product_title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-4 pb-20 relative">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                      {purchase.product_title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Bởi {purchase.creator_name}
                    </p>
                    <div className="text-sm text-gray-500 mb-2">
                      Mua ngày: {new Date(purchase.purchase_date).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      Phương thức: {purchase.payment_method}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      Đã tải: {purchase.download_count}/{purchase.max_downloads} lần
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <button
                        onClick={() => handleDownload(purchase)}
                        disabled={purchase.download_count >= purchase.max_downloads}
                        className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                      >
                        {purchase.download_count >= purchase.max_downloads ? 'Hết lượt tải' : 'Tải xuống'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'pending' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chờ thanh toán ({pendingProducts.length})</h2>
          {pendingProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <i className="ri-time-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng nào</h3>
              <p className="text-gray-500">Bạn không có đơn hàng nào đang chờ thanh toán</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {pendingProducts.map((purchase) => (
                <div key={purchase.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img
                      src={purchase.product_image}
                      alt={purchase.product_title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-4 pb-20 relative">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                      {purchase.product_title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Bởi {purchase.creator_name}
                    </p>
                    <div className="text-sm text-gray-500 mb-2">
                      Đặt hàng: {new Date(purchase.purchase_date).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      Phương thức: {purchase.payment_method}
                    </div>
                    <div className="font-bold text-lg text-gray-900 mb-4">
                      ${purchase.price}
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                      <button
                        onClick={() => handleContinuePayment(purchase)}
                        className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                      >
                        Tiếp tục thanh toán
                      </button>
                      <button
                        onClick={() => handleCancelOrder(purchase.id)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
