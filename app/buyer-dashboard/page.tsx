
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import PurchasedProducts from './PurchasedProducts';

export default function BuyerDashboardPage() {
  const [activeTab, setActiveTab] = useState('purchased');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Người mua</h1>
          <p className="text-gray-600">Quản lý các sản phẩm đã mua và theo dõi trạng thái thanh toán</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('purchased')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'purchased'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sản phẩm đã mua
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Chờ thanh toán
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <PurchasedProducts activeTab={activeTab} />
      </main>
    </div>
  );
}
