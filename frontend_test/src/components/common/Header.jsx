import React from 'react';
import { Search, ShoppingCart } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-wider cursor-pointer">
          MINI<span className="text-yellow-300">SHOP</span>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex-1 max-w-3xl hidden md:flex rounded-sm overflow-hidden bg-white">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm, danh mục..." 
            className="flex-1 text-gray-800 px-4 py-2 outline-none text-sm"
          />
          <button className="bg-blue-800 hover:bg-blue-900 px-6 flex items-center justify-center transition-colors">
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Giỏ hàng & Tài khoản */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:block text-sm cursor-pointer hover:text-gray-200">
            Đăng nhập / Đăng ký
          </div>
          <div className="relative cursor-pointer group">
            <ShoppingCart className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-blue-600">
              0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;