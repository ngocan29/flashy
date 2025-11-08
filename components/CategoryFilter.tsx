
'use client';

import { useState, useEffect } from 'react';
import { categoryApi } from '../lib/api';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'Tất cả', description: 'Hiển thị tất cả sản phẩm' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      const transformedCategories = [
        { id: 'all', name: 'Tất cả', description: 'Hiển thị tất cả sản phẩm' },
        ...data.map((cat: any) => ({
          id: cat.id.toString(),
          name: cat.name,
          description: cat.description || `Danh mục ${cat.name}`
        }))
      ];
      setCategories(transformedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fall back to mock categories
      setCategories([
        { id: 'all', name: 'Tất cả', description: 'Hiển thị tất cả sản phẩm' },
        { id: 'web', name: 'Web', description: 'Ứng dụng và website' },
        { id: 'app', name: 'App', description: 'Ứng dụng di động' },
        { id: 'software', name: 'Software', description: 'Phần mềm máy tính' },
        { id: 'cad', name: 'CAD', description: 'Thiết kế kỹ thuật' },
        { id: 'excel', name: 'Excel Addin', description: 'Tiện ích mở rộng Excel' },
        { id: 'doc', name: 'Documents', description: 'Tài liệu và mẫu' },
        { id: 'lip', name: 'Lip', description: 'Thư viện và gói' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <div key={category.id} className="relative group">
            <button
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
            {/* Tooltip */}
            {category.description && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                {category.description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
