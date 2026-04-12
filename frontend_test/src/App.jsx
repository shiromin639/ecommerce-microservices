import React from 'react';
import Header from './components/common/Header';
import ProductCard from './components/common/ProductCard';

function App() {
  // Dữ liệu mẫu
  const products = [
    { id: 1, title: "Sản phẩm 1", price: 150000, sold: "1.2k", image: "" },
    { id: 2, title: "Sản phẩm 2", price: 350000, sold: "850", image: "" },
    { id: 3, title: "Sản phẩm 3", price: 590000, sold: "3.4k", image: "" },
    { id: 4, title: "Sản phẩm 4", price: 850000, sold: "240", image: "" },
    { id: 5, title: "Sản phẩm 5", price: 299000, sold: "1.1k", image: "" },
    { id: 6, title: "Sản phẩm 6", price: 1200000, sold: "450", image: "" }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5fa] font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* Product Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Sản phẩm</h2>
          
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