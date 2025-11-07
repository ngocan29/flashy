
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginModal from './LoginModal';

interface User {
  providerID: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    try {
      // Xóa thông tin user khỏi localStorage
      localStorage.removeItem('user');
      setUser(null);
      setShowUserMenu(false);
      alert('Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
              <i className="ri-store-2-fill text-white text-lg"></i>
            </div>
            <span className="font-['Pacifico'] text-xl text-gray-900">Digital Store</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium cursor-pointer">
              Trang chủ
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium cursor-pointer">
              Về chúng tôi
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Đăng nhập
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <i className="ri-user-fill text-gray-600"></i>
                    )}
                  </div>
                  <span className="font-medium">{user.name}</span>
                  <i className="ri-arrow-down-s-line"></i>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">ID: {user.providerID}</p>
                    </div>
                    
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="ri-dashboard-line mr-2"></i>
                      Dashboard Người bán
                    </Link>
                    <Link 
                      href="/buyer-dashboard" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="ri-shopping-bag-line mr-2"></i>
                      Dashboard Người mua
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <i className="ri-logout-box-line mr-2"></i>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </header>
  );
}
