import React from 'react';
import Header from './components/common/Header';
import ProductCard from './components/common/ProductCard';

function App() {
  // Dữ liệu mẫu về Danh mục (Categories)
  const categories = [
    { id: 1, name: "MacBook", icon: "💻" },
    { id: 2, name: "Laptop Gaming", icon: "🎮" },
    { id: 3, name: "Văn Phòng", icon: "🏢" },
    { id: 4, name: "Đồ Họa Kỹ Thuật", icon: "🎨" },
    { id: 5, name: "Linh Kiện PC", icon: "⚙️" },
    { id: 6, name: "Màn Hình", icon: "🖥️" },
    { id: 7, name: "Phụ Kiện", icon: "🎧" },
    { id: 8, name: "Trả Góp 0%", icon: "💳" }
  ];

  // Dữ liệu mẫu về Laptop
  const products = [
    { id: 1, title: "Apple MacBook Air M2 2022", price: 24990000, sold: "1.2k", image: "" },
    { id: 2, title: "Dell XPS 15 9530", price: 39990000, sold: "850", image: "" },
    { id: 3, title: "Lenovo ThinkPad X1 Carbon Gen 11", price: 34500000, sold: "530", image: "" },
    { id: 4, title: "Asus ROG Strix G15", price: 28990000, sold: "2.1k", image: "" },
    { id: 5, title: "HP Envy x360 2-in-1", price: 21500000, sold: "1.1k", image: "" },
    { id: 6, title: "Acer Nitro 5 Gaming", price: 18490000, sold: "3.4k", image: "" }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5fa] font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* 1. Banner Section */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl overflow-hidden shadow-sm mb-6 relative h-48 md:h-64 flex items-center justify-center">
          <div className="text-center text-white z-10 px-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-md">
              Đại Tiệc Laptop - Giảm Đến 50%
            </h1>
            <p className="text-sm md:text-lg font-medium drop-shadow">
              Săn ngay deal hot, rước máy xịn về nhà!
            </p>
            <button className="mt-4 px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-300 transition-colors shadow-md">
              Khám Phá Ngay
            </button>
          </div>
          {/* Overlay làm tối background nếu sau này bạn chèn ảnh thật vào bg */}
          <div className="absolute inset-0 bg-black opacity-10"></div>
        </div>

        {/* 2. Categories Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Danh Mục Nổi Bật</h2>
          
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mb-2 group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-300 border border-gray-100">
                  {cat.icon}
                </div>
                <span className="text-xs text-center font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Product Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-800">Laptop Nổi Bật</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">Xem tất cả</a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                title={product.title}
                price={product.price}
                imageUrl={product.image}
                sold={product.sold}
              />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;