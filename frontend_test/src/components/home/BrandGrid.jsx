import React from 'react';
import { brands } from '../../data';

const BrandGrid = () => {
  return (
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
  );
};

export default BrandGrid;
