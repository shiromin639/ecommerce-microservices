// src/layouts/MainLayout.jsx
import React from 'react';
import Header from '../components/common/Header';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      {/* Phần children chính là nội dung của từng trang (Trang chủ, Giỏ hàng...) sẽ được nhúng vào đây */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Gợi ý: Bạn có thể tự code thêm Footer và đặt ở đây */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-auto">
      </footer>
    </div>
  );
};

export default MainLayout;