'use client';

import { useState, useRef } from 'react';

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    console.log('Mouse entered!');
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/checkout/${product.id}`;
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Tải xuống sản phẩm: ${product.title}`);
  };

  return (
    <>
      <div 
        ref={cardRef}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          {!imageError ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="ri-image-line text-4xl text-gray-400"></i>
            </div>
          )}
        </div>

        <div className="p-4 pb-20 relative">
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

          <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
            <button 
              onClick={handleBuyClick}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
            >
              Buy
            </button>
            <button 
              onClick={handleDownloadClick}
              className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
            >
              Download
            </button>
          </div>
        </div>

        {/* Tooltip overlay hiển thị ngay trên card - không che nút */}
        {showTooltip && (
          <div className="absolute top-0 left-0 right-0 bottom-20 bg-white bg-opacity-95 rounded-t-lg p-4 z-10 backdrop-blur-sm">
            <div className="space-y-3 h-full overflow-y-auto">
              {/* Tiêu đề */}
              <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">
                {product.title}
              </h4>
              
              {/* Thông tin giấy phép */}
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Loại giấy phép:</span>
                  <p className="text-gray-600 mt-1">{product.permit}</p>
                </div>
                {product.permit === 'License' && product.permit_life && (
                  <div>
                    <span className="font-medium text-gray-700">Thời hạn:</span>
                    <p className="text-gray-600 mt-1">{product.permit_life} tháng</p>
                  </div>
                )}
              </div>

              {/* Mô tả sản phẩm */}
              {product.description && product.description.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-700">Mô tả sản phẩm:</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {product.description.map((desc, index) => (
                      <li key={index} className="flex items-start">
                        <i className="ri-checkbox-circle-line text-green-500 mt-0.5 mr-2 text-sm flex-shrink-0"></i>
                        <span className="leading-relaxed">{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Video demo (nếu có) */}
              {product.video_url && (
                <div className="pt-2 border-t">
                  <span className="inline-flex items-center text-sm text-blue-600">
                    <i className="ri-play-circle-line mr-1"></i>
                    Có video demo
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}