
'use client';

import { useState, useEffect } from 'react';
import { productApi, API_BASE_URL } from '../../lib/api';

interface Payment {
  id: string;
  user_email: string;
  product_id: string;
  amount: number;
  status: string;
  created_at: string;
  product_title?: string;
  product_image?: string;
}

export default function RevenueStats() {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalRevenue: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0
  });

  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetchStatsData();
  }, []);

  const fetchStatsData = async () => {
    try {
      // Fetch payments data
      const paymentsResponse = await fetch(`${API_BASE_URL}/payments`);
      const payments = paymentsResponse.ok ? await paymentsResponse.json() : [];
      
      // Fetch products data
      const products = await productApi.getAll();

      // Calculate stats
      const totalRevenue = payments
        .filter((payment: Payment) => payment.status === 'completed')
        .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);

      const completedPayments = payments.filter((p: Payment) => p.status === 'completed').length;
      const pendingPayments = payments.filter((p: Payment) => p.status === 'pending').length;
      const failedPayments = payments.filter((p: Payment) => p.status === 'failed').length;

      setStats({
        totalViews: 1247, // Mock data - this would come from analytics
        totalRevenue,
        completedPayments,
        pendingPayments,
        failedPayments
      });

      // Merge payments with product info
      const paymentsWithProducts = payments.map((payment: Payment) => {
        const product = products.find((p: any) => p.id.toString() === payment.product_id);
        return {
          ...payment,
          product_title: product?.title || 'Unknown Product',
          product_image: product?.image_url || ''
        };
      });

      setRecentPayments(paymentsWithProducts);
    } catch (error) {
      console.error('Error fetching stats data:', error);
      // Fallback to empty data or mock data
      setStats({
        totalViews: 0,
        totalRevenue: 0,
        completedPayments: 0,
        pendingPayments: 0,
        failedPayments: 0
      });
      setRecentPayments([]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Hoàn thành</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Đang chờ</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Thất bại</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Không xác định</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Thống kê doanh thu</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="ri-eye-line text-white"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng lượt xem</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-white"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="ri-check-line text-white"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đã thanh toán</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-white"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đang chờ</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Giao dịch gần đây</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={payment.product_image}
                          alt={payment.product_title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.product_title}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {payment.product_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date().toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
