'use client'

import { useState, useEffect } from 'react'
import { productApi } from '../lib/api'
import ProductCard from './ProductCard'

interface Product {
  id: string
  title: string
  creator_name: string
  rate: number
  rate_count: number
  price: number
  price_sale?: number
  image_url: string
  video_url?: string
  description: string[]
  permit: string
  permit_life: number
  category_id: string
  user_id: number
}

interface ProductListProps {
  selectedCategory: string
  searchQuery: string
}

export default function ProductList({ selectedCategory, searchQuery }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchQuery])

  const fetchProducts = async () => {
    setLoading(true)
    
    try {
      // Fetch products from API
      const apiProducts = await productApi.getAll()
      let filteredProducts: Product[] = apiProducts

      // Lọc theo danh mục
      if (selectedCategory && selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter((product: Product) => product.category_id === selectedCategory)
      }

      // Tìm kiếm theo tiêu đề
      if (searchQuery) {
        filteredProducts = filteredProducts.filter((product: Product) => 
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setProducts(filteredProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to empty array or handle error as needed
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[...Array(15)].map((_, index) => (
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
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <i className="ri-search-line text-4xl text-gray-400"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
        <p className="text-gray-500">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
