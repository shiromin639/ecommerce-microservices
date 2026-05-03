import React from 'react';
import Header from './components/common/Header';
import ProductCard from './components/common/ProductCard';

function App() {
  // 1. Dữ liệu mẫu: Danh mục
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

  // 2. Dữ liệu mẫu: Sản phẩm
  const products = [
    { id: 1, title: "Apple MacBook Air M2 2022", price: 24990000, sold: "1.2k", image: "" },
    { id: 2, title: "Dell XPS 15 9530", price: 39990000, sold: "850", image: "" },
    { id: 3, title: "Lenovo ThinkPad X1 Carbon Gen 11", price: 34500000, sold: "530", image: "" },
    { id: 4, title: "Asus ROG Strix G15", price: 28990000, sold: "2.1k", image: "" },
    { id: 5, title: "HP Envy x360 2-in-1", price: 21500000, sold: "1.1k", image: "" },
    { id: 6, title: "Acer Nitro 5 Gaming", price: 18490000, sold: "3.4k", image: "" }
  ];

  // 3. Dữ liệu mẫu: Chính sách & Dịch vụ (Mới)
  const policies = [
    { id: 1, title: "Miễn phí vận chuyển", desc: "Đơn từ 500k", icon: "🚚" },
    { id: 2, title: "Bảo hành chính hãng", desc: "Lên đến 24 tháng", icon: "🛡️" },
    { id: 3, title: "Đổi trả tận nơi", desc: "Trong vòng 7 ngày", icon: "🔄" },
    { id: 4, title: "Hỗ trợ 24/7", desc: "Hotline: 1800.xxxx", icon: "📞" }
  ];

  // 4. Dữ liệu mẫu: Thương hiệu nổi bật (Mới)
  const brands = ["Apple", "Dell", "Asus", "Lenovo", "HP", "Acer", "MSI", "Gigabyte"];

  return (
    <div className="min-h-screen bg-[#f5f5fa] font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* --- 1. BANNER SECTION --- */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl overflow-hidden shadow-sm relative h-48 md:h-80 flex items-center justify-center">
          <div className="text-center text-white z-10 px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Đại Tiệc Laptop - Giảm Đến 50%
            </h1>
            <p className="text-base md:text-xl font-medium drop-shadow mb-6">
              Săn ngay deal hot, rước máy xịn về nhà!
            </p>
            <button className="px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-300 transition-transform transform hover:scale-105 shadow-lg">
              Khám Phá Ngay
            </button>
          </div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>

        {/* --- 2. CHÍNH SÁCH & DỊCH VỤ (MỚI) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {policies.map((policy) => (
            <div key={policy.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-3">
              <div className="text-3xl">{policy.icon}</div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">{policy.title}</h3>
                <p className="text-xs text-gray-500">{policy.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- 3. CATEGORIES SECTION --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Danh Mục Nổi Bật</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-col items-center cursor-pointer group">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-2 group-hover:-translate-y-2 group-hover:shadow-lg transition-all duration-300 border border-gray-100">
                  {cat.icon}
                </div>
                <span className="text-sm text-center font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- 4. FLASH SALE SECTION (MỚI) --- */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-1 rounded-xl shadow-sm">
          <div className="bg-white p-4 rounded-lg h-full w-full">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-black text-red-600 italic">⚡ FLASH SALE</h2>
                <div className="hidden md:flex space-x-1">
                  <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">02</span>
                  <span className="font-bold">:</span>
                  <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">45</span>
                  <span className="font-bold">:</span>
                  <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">30</span>
                </div>
              </div>
              <a href="#" className="text-sm text-red-600 hover:underline font-medium">Xem tất cả deal &gt;</a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Tái sử dụng ProductCard nhưng giả lập giá giảm */}
              {products.slice(0, 6).map((product) => (
                <div key={`flash-${product.id}`} className="relative border border-red-100 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 z-10 rounded-bl-lg">
                    -15%
                  </div>
                  <ProductCard 
                    title={product.title}
                    price={product.price * 0.85} // Giảm 15%
                    imageUrl={product.image}
                    sold={product.sold}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 5. THƯƠNG HIỆU CHÍNH HÃNG (MỚI) --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Thương Hiệu Chính Hãng</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {brands.map((brand, index) => (
              <div key={index} className="h-12 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-bold text-lg hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-colors">
                {brand}
              </div>
            ))}
          </div>
        </div>

        {/* --- 6. PRODUCT SECTION (GỢI Ý HÔM NAY) --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-800">Gợi Ý Hôm Nay</h2>
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
            {/* Lặp lại để trang trông dài và phong phú hơn */}
            {products.map((product) => (
              <ProductCard 
                key={`dup-${product.id}`}
                title={product.title}
                price={product.price}
                imageUrl={product.image}
                sold={product.sold}
              />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <button className="px-8 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
              Xem thêm sản phẩm
            </button>
          </div>
        </div>

      </main>

      {/* --- 7. FOOTER (MỚI) --- */}
      <footer className="bg-white border-t mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-800 mb-4 text-lg">TechStore</h3>
            <p className="text-sm text-gray-600 mb-2">Hệ thống bán lẻ laptop, PC và phụ kiện công nghệ hàng đầu.</p>
            <p className="text-sm text-gray-600">Hotline: 1800 1234</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Về chúng tôi</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><a href="#" className="hover:text-blue-600">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-blue-600">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-blue-600">Hệ thống cửa hàng</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Chính sách</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><a href="#" className="hover:text-blue-600">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-blue-600">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-blue-600">Bảo mật thông tin</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Đăng ký nhận tin</h3>
            <div className="flex">
              <input type="email" placeholder="Email của bạn" className="border px-3 py-2 rounded-l-lg w-full text-sm focus:outline-none focus:border-blue-500" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:bg-blue-700">Gửi</button>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 py-4 text-center text-sm text-gray-500">
          © 2026 TechStore. Tất cả quyền được bảo lưu.
        </div>
      </footer>
    </div>
  );
}

export default App;