import React from 'react';
import { policies } from '../../data';

const PolicyList = () => {
  return (
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
  );
};

export default PolicyList;
