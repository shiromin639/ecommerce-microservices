/**
 * HomePage.jsx  —  Trang chủ
 * Sections:
 *  1. HeroSlider (banner lớn)
 *  2. Best Sellers
 *  3. Features (USP của shop)
 *  4. Hot Deals
 *  5. Brand showcase
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/ui/HeroSlider';
import ProductCard, { ProductCardSkeleton } from '../components/product/ProductCard';
import { productAPI } from '../api';
import { formatCurrency } from '../utils/format';
import styles from './HomePage.module.css';

const FEATURES = [
  {
    icon: '🔒',
    title: 'Bảo hành chính hãng',
    desc:  'Tất cả sản phẩm đều có bảo hành toàn quốc từ nhà sản xuất.',
  },
  {
    icon: '🚚',
    title: 'Giao hàng toàn quốc',
    desc:  'Giao nhanh 2–4 giờ nội thành. Miễn phí đơn từ 10 triệu.',
  },
  {
    icon: '💳',
    title: 'Trả góp 0%',
    desc:  'Hỗ trợ trả góp 0% qua thẻ tín dụng, tối đa 24 tháng.',
  },
  {
    icon: '🔄',
    title: 'Đổi trả 30 ngày',
    desc:  'Đổi trả miễn phí trong 30 ngày nếu có lỗi từ nhà sản xuất.',
  },
];

const BRANDS = [
  { name: 'Apple',     slug: 'apple'     },
  { name: 'Dell',      slug: 'dell'      },
  { name: 'ASUS',      slug: 'asus'      },
  { name: 'HP',        slug: 'hp'        },
  { name: 'Lenovo',    slug: 'lenovo'    },
  { name: 'MSI',       slug: 'msi'       },
];

export default function HomePage() {
  const [featured,  setFeatured]  = useState([]);
  const [hotDeals,  setHotDeals]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, hotRes] = await Promise.all([
          productAPI.getFeatured(8),
          productAPI.getHotDeals(4),
        ]);
        setFeatured(featuredRes.data || []);
        setHotDeals(hotRes.data || []);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className={styles.page}>
      {/* ── 1. HERO SLIDER ── */}
      <HeroSlider />

      {/* ── 2. FEATURES ── */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <div>
                  <h4 className={styles.featureTitle}>{f.title}</h4>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. BEST SELLERS ── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionTag}>Được yêu thích nhất</span>
              <h2 className={styles.sectionTitle}>Best Sellers</h2>
            </div>
            <Link to="/products?featured=true" className={styles.viewAll}>
              Xem tất cả →
            </Link>
          </div>

          <div className={styles.productGrid}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i}/>)
              : featured.slice(0, 8).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i}/>
                ))
            }
          </div>
        </div>
      </section>

      {/* ── 4. PROMO BANNER ── */}
      <section className={styles.promoBanner}>
        <div className={styles.container}>
          <div className={styles.promoInner}>
            <div className={styles.promoContent}>
              <span className={styles.promoTag}>⚡ Ưu đãi đặc biệt</span>
              <h2 className={styles.promoTitle}>Trade-in laptop cũ<br/>Lên đời dễ dàng</h2>
              <p className={styles.promoDesc}>
                Mang laptop cũ đến định giá miễn phí. Thu giá cao, nhận ưu đãi thêm đến 2 triệu khi mua máy mới.
              </p>
              <Link to="/trade-in" className={styles.promoBtn}>
                Tìm hiểu thêm
              </Link>
            </div>
            <div className={styles.promoStats}>
              {[
                { value: '50,000+', label: 'Khách hàng tin tưởng' },
                { value: '99%',     label: 'Đánh giá tích cực'    },
                { value: '5 năm',   label: 'Kinh nghiệm'          },
              ].map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. HOT DEALS ── */}
      {hotDeals.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={`${styles.sectionTag} ${styles.sectionTagRed}`}>🔥 Giảm giá sốc</span>
                <h2 className={styles.sectionTitle}>Hot Deals</h2>
              </div>
              <Link to="/products?hot=true" className={styles.viewAll}>Xem tất cả →</Link>
            </div>

            <div className={styles.hotDealsGrid}>
              {hotDeals.map((p, i) => (
                <HotDealCard key={p.id} product={p} index={i}/>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. BRAND SHOWCASE ── */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleLight}>Thương hiệu nổi bật</h2>
          <div className={styles.brands}>
            {BRANDS.map((brand) => (
              <Link key={brand.slug} to={`/products?brand=${brand.slug}`} className={styles.brandCard}>
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Hot Deal Card layout ngang ── */
function HotDealCard({ product, index }) {
  const { useCartStore } = require('../store');
  const { addItem } = useCartStore();
  const [adding, setAdding] = useState(false);

  const discount = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : null;

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    await addItem(product.id);
    setAdding(false);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className={styles.hotCard}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={styles.hotImageWrap}>
        <img
          src={product.images?.[0] || '/placeholder-laptop.jpg'}
          alt={product.name}
          className={styles.hotImage}
        />
        {discount && (
          <span className={styles.hotDiscount}>-{discount}%</span>
        )}
      </div>
      <div className={styles.hotInfo}>
        <p className={styles.hotBrand}>{product.brand}</p>
        <h3 className={styles.hotName}>{product.name}</h3>
        <div className={styles.hotPriceRow}>
          <span className={styles.hotPrice}>{formatCurrency(product.salePrice || product.price)}</span>
          {product.salePrice && (
            <span className={styles.hotOldPrice}>{formatCurrency(product.price)}</span>
          )}
        </div>
        <button
          className={styles.hotAddBtn}
          onClick={handleAdd}
          disabled={adding}
        >
          {adding ? 'Đang thêm...' : 'Thêm vào giỏ'}
        </button>
      </div>
    </Link>
  );
}
