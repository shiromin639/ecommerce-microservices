// src/components/common/CategoryCard.jsx
import React from 'react';

const CategoryCard = ({ title, items, linkText }) => {
  return (
    <div className="bg-white p-4 z-10 flex flex-col h-100">
      <h2 className="text-xl font-bold mb-4 text-gray-900">{title}</h2>
      
      {/* Grid 2x2 cho 4 sản phẩm nhỏ */}
      <div className="grid grid-cols-2 gap-4 flex-1 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col cursor-pointer group">
            <div className="flex-1 bg-gray-50 flex items-center justify-center p-2 mb-2">
              <img 
                src={item.image} 
                alt={item.name} 
                className="max-h-24 object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs text-gray-800">{item.name}</span>
          </div>
        ))}
      </div>

      <a href="#" className="text-sm text-blue-700 hover:text-red-700 hover:underline">
        {linkText}
      </a>
    </div>
  );
};

export default CategoryCard;