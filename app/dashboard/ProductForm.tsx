
'use client';

import { useState } from 'react';
import { mockCategories } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface ProductFormProps {
  product?: any;
  onSave: (product: any) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || [''],
    categoryid: product?.categoryid || '',
    price: product?.price || '',
    saleprice: product?.saleprice || '',
    trialday: product?.trialday || 0,
    islicense: product?.islicense || 'yes',
    licenseday: product?.licenseday || 365,
    donate: product?.donate || 'no',
    ispaidfirst: product?.ispaidfirst || 'yes',
    donateminprice: product?.donateminprice || 10000,
    videodemo: product?.videodemo || '',
    download: product?.download || '',
    ratecount: product?.ratecount || 0,
    rateavg: product?.rateavg || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.categoryid) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!user) {
      alert('Vui lòng đăng nhập để tạo sản phẩm');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      saleprice: formData.saleprice ? parseFloat(formData.saleprice) : 0,
      trialday: parseInt(formData.trialday.toString()) || 0,
      licenseday: parseInt(formData.licenseday.toString()) || 365,
      donateminprice: parseFloat(formData.donateminprice.toString()) || 10000,
      ratecount: parseInt(formData.ratecount.toString()) || 0,
      rateavg: parseFloat(formData.rateavg.toString()) || 0,
      categoryid: parseInt(formData.categoryid),
      description: formData.description.filter((desc: string) => desc.trim() !== ''),
      providerID: user.providerID // Thêm providerID từ user đã đăng nhập
    };

    try {
      // Gửi dữ liệu đến API backend
      const response = await fetch('http://localhost:3006/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Product created:', result);
        onSave(productData);
      } else {
        const error = await response.json();
        alert(`Lỗi khi tạo sản phẩm: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Lỗi kết nối. Vui lòng thử lại!');
    }
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescription = [...formData.description];
    newDescription[index] = value;
    setFormData({ ...formData, description: newDescription });
  };

  const addDescription = () => {
    setFormData({
      ...formData,
      description: [...formData.description, '']
    });
  };

  const removeDescription = (index: number) => {
    const newDescription = formData.description.filter((_: string, i: number) => i !== index);
    setFormData({ ...formData, description: newDescription });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề sản phẩm *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                value={formData.categoryid}
                onChange={(e) => setFormData({ ...formData, categoryid: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-8"
                required
              >
                <option value="">Chọn danh mục</option>
                {mockCategories.filter(cat => cat.id !== 'all').map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá gốc ($) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá khuyến mãi ($)
              </label>
              <input
                type="number"
                value={formData.saleprice}
                onChange={(e) => setFormData({ ...formData, saleprice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày dùng thử
              </label>
              <input
                type="number"
                value={formData.trialday}
                onChange={(e) => setFormData({ ...formData, trialday: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giấy phép license
              </label>
              <select
                value={formData.islicense}
                onChange={(e) => setFormData({ ...formData, islicense: e.target.value as 'yes' | 'no' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                <option value="yes">Có</option>
                <option value="no">Không</option>
              </select>
            </div>
            {/* License day - chỉ hiện khi islicense = yes */}
          {formData.islicense === 'yes' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời hạn license (ngày)
              </label>
              <input
                type="number"
                value={formData.licenseday}
                onChange={(e) => setFormData({ ...formData, licenseday: parseInt(e.target.value)  })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="365"
              />
            </div>
          )}
            
          </div>

          

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cho phép donate
              </label>
              <select
                value={formData.donate}
                onChange={(e) => setFormData({ ...formData, donate: e.target.value as 'no' | 'yes' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                <option value="yes">Có</option>
                <option value="no">Không</option>
              </select>
            </div>

          {/* Donate min price - chỉ hiện khi donate = yes */}
          {formData.donate === 'yes' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá donate tối thiểu ($)
              </label>
              <input
                type="number"
                value={formData.donateminprice}
                onChange={(e) => setFormData({ ...formData, donateminprice: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
                placeholder="10000"
              />
            </div>
          )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thanh toán trước
              </label>
              <select
                value={formData.ispaidfirst}
                onChange={(e) => setFormData({ ...formData, ispaidfirst: e.target.value as 'yes' | 'no' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                <option value="yes">Có</option>
                <option value="no">Không</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL video demo
            </label>
            <input
              type="url"
              value={formData.videodemo}
              onChange={(e) => setFormData({ ...formData, videodemo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://youtube.com/embed/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link/Key download
            </label>
            <textarea
              value={formData.download}
              onChange={(e) => setFormData({ ...formData, download: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Nhập link download hoặc key sản phẩm..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả sản phẩm
            </label>
            <div className="space-y-2">
              {formData.description.map((desc: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mô tả..."
                  />
                  {formData.description.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDescription(index)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDescription}
                className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
              >
                <i className="ri-add-line mr-1"></i>
                Thêm mô tả
              </button>
            </div>
          </div>

          {/* Rating section (optional - for editing existing products) */}
          {product && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá trung bình
                </label>
                <input
                  type="number"
                  value={formData.rateavg}
                  onChange={(e) => setFormData({ ...formData, rateavg: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="5"
                  step="0.1"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượt đánh giá
                </label>
                <input
                  type="number"
                  value={formData.ratecount}
                  onChange={(e) => setFormData({ ...formData, ratecount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  disabled
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              {product ? 'Cập nhật' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
