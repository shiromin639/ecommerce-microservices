import React from 'react';
import Header from './components/common/Header';
import ProductCard from './components/common/ProductCard';

function App() {
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

        {/* Product Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Laptop Nổi Bật</h2>
          
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
