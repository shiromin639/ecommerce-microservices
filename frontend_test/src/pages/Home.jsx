import React from 'react';
import Banner from '../components/home/Banner';
import PolicyList from '../components/home/PolicyList';
import CategoryGrid from '../components/home/CategoryGrid';
import FlashSale from '../components/home/FlashSale';
import BrandGrid from '../components/home/BrandGrid';
import ProductGrid from '../components/home/ProductGrid';

const Home = () => {
  return (
    <div className="space-y-6">
      <Banner />
      <PolicyList />
      <CategoryGrid />
      <FlashSale />
      <BrandGrid />
      <ProductGrid />
    </div>
  );
};

export default Home;
