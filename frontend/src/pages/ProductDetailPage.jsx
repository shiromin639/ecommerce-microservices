/**
 * ProductDetailPage.jsx  —  Trang chi tiết sản phẩm
 * - Image gallery với thumbnail
 * - Bảng thông số kỹ thuật
 * - Nút thêm vào giỏ / mua ngay
 * - Related products
 * - Breadcrumb
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../store';
import { productAPI } from '../api';
import { formatCurrency } from '../utils/format';
import ProductCard, { ProductCardSkeleton } from '../components/product/ProductCard';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { slug }      = useParams();
  const navigate      = useNavigate();
  const { product, loading, error } = useProduct(slug);
  const { addItem }   = useCartStore();

  const [activeImg,  setActiveImg]  = useState(0);
  const [qty,        setQty]        = useState(1);
  const [adding,     setAdding]     = useState(false);
  const [activeTab,  setActiveTab]  = useState('specs');
  const [related,    setRelated]    = useState([]);

  /* Load related products */
  useEffect(() => {
    if (!product) return;
    productAPI.getAll({ brand: product.brand, limit: 4 })
      .then(res => setRelated((res.data || []).filter(p => p.id !== product.id).slice(0, 4)))
      .catch(() => {});
  }, [product]);

  /* Reset active image when product changes */
  useEffect(() => { setActiveImg(0); }, [slug]);

  const handleAddToCart = async () => {
    if (adding) return;
    setAdding(true);
    const ok = await addItem(product.id, qty);
    setAdding(false);
    if (ok) setQty(1);
  };

  const handleBuyNow = async () => {
    const ok = await addItem(product.id, qty);
    if (ok) navigate('/checkout');
  };

  /* Loading */
  if (loading) return <ProductDetailSkeleton />;

  /* Error */
  if (error || !product) {
    return (
      <div className={styles.errorPage}>
        <h2>Không tìm thấy sản phẩm</h2>
        <Link to="/products" className={styles.backBtn}>← Quay lại danh sách</Link>
      </div>
    );
  }

  const {
    name, brand, price, salePrice, images = [], specs = {},
    description, isFeatured, isHotDeal, stock, category,
  } = product;

  const displayPrice   = salePrice || price;
  const discountAmount = salePrice ? price - salePrice : 0;
  const discountPct    = salePrice ? Math.round(discountAmount / price * 100) : 0;

  const SPEC_LABELS = {
    cpu:     'Bộ xử lý (CPU)',
    gpu:     'Card đồ họa (GPU)',
    ram:     'Bộ nhớ RAM',
    ssd:     'Ổ cứng SSD',
    display: 'Màn hình',
    os:      'Hệ điều hành',
    battery: 'Pin',
    weight:  'Trọng lượng',
    ports:   'Cổng kết nối',
    wifi:    'Wi-Fi / Bluetooth',
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* BREADCRUMB */}
        <nav className={styles.breadcrumb}>
          <Link to="/">Trang chủ</Link>
          <span>›</span>
          <Link to="/products">Laptop</Link>
          {category && (
            <>
              <span>›</span>
              <Link to={`/products?category=${category}`}>{category}</Link>
            </>
          )}
          <span>›</span>
          <span>{name}</span>
        </nav>

        {/* MAIN SECTION */}
        <div className={styles.productSection}>

          {/* LEFT — Gallery */}
          <div className={styles.gallery}>
            {/* Main image */}
            <div className={styles.mainImageWrap}>
              {(isHotDeal || isFeatured) && (
                <span className={`${styles.galleryBadge} ${isHotDeal ? styles.badgeHot : styles.badgeFeatured}`}>
                  {isHotDeal ? '🔥 Hot Deal' : '⭐ Nổi bật'}
                </span>
              )}
              <img
                src={images[activeImg] || '/placeholder-laptop.jpg'}
                alt={`${name} - ảnh ${activeImg + 1}`}
                className={styles.mainImage}
              />
              {discountPct > 0 && (
                <span className={styles.discountBadge}>-{discountPct}%</span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`${name} thumbnail ${i + 1}`}/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info */}
          <div className={styles.info}>
            <p className={styles.brand}>{brand}</p>
            <h1 className={styles.name}>{name}</h1>

            {/* Quick specs chips */}
            <div className={styles.quickSpecs}>
              {specs.cpu  && <span className={styles.specChip}>{specs.cpu}</span>}
              {specs.ram  && <span className={styles.specChip}>{specs.ram} RAM</span>}
              {specs.ssd  && <span className={styles.specChip}>{specs.ssd} SSD</span>}
            </div>

            {/* Price */}
            <div className={styles.priceSection}>
              <span className={styles.price}>{formatCurrency(displayPrice)}</span>
              {salePrice && (
                <div className={styles.priceDetails}>
                  <span className={styles.oldPrice}>{formatCurrency(price)}</span>
                  <span className={styles.saveBadge}>
                    Tiết kiệm {formatCurrency(discountAmount)}
                  </span>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className={styles.stockRow}>
              {stock > 0 ? (
                <span className={styles.inStock}>
                  <span className={styles.stockDot}/>
                  Còn hàng {stock <= 5 ? `(chỉ còn ${stock})` : ''}
                </span>
              ) : (
                <span className={styles.outOfStock}>Hết hàng</span>
              )}
            </div>

            {/* Quantity */}
            <div className={styles.qtySection}>
              <span className={styles.qtyLabel}>Số lượng:</span>
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >−</button>
                <input
                  type="number"
                  className={styles.qtyInput}
                  value={qty}
                  min={1}
                  max={stock}
                  onChange={(e) => setQty(Math.max(1, Math.min(stock, Number(e.target.value))))}
                />
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty(q => Math.min(stock, q + 1))}
                  disabled={qty >= stock}
                >+</button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={styles.ctaButtons}>
              <button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                disabled={adding || stock === 0}
              >
                {adding ? (
                  <><span className={styles.spinner}/> Đang thêm...</>
                ) : (
                  <><CartIcon/> Thêm vào giỏ hàng</>
                )}
              </button>

              <button
                className={styles.buyNowBtn}
                onClick={handleBuyNow}
                disabled={stock === 0}
              >
                Mua ngay
              </button>
            </div>

            {/* Perks */}
            <div className={styles.perks}>
              {[
                { icon: '🛡️', text: 'Bảo hành chính hãng 12–24 tháng' },
                { icon: '🚀', text: 'Giao hàng nhanh 2–4 giờ nội thành' },
                { icon: '🔄', text: 'Đổi trả miễn phí trong 30 ngày'    },
                { icon: '💳', text: 'Trả góp 0% qua thẻ tín dụng'       },
              ].map((p) => (
                <div key={p.text} className={styles.perk}>
                  <span>{p.icon}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABS: Thông số / Mô tả */}
        <div className={styles.tabs}>
          <div className={styles.tabBar}>
            {['specs', 'description'].map((tab) => (
              <button
                key={tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'specs' ? 'Thông số kỹ thuật' : 'Mô tả chi tiết'}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'specs' ? (
              <div className={styles.specsTable}>
                {Object.entries(SPEC_LABELS).map(([key, label]) =>
                  specs[key] ? (
                    <div key={key} className={styles.specRow}>
                      <span className={styles.specLabel}>{label}</span>
                      <span className={styles.specValue}>{specs[key]}</span>
                    </div>
                  ) : null
                )}
              </div>
            ) : (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: description || '<p>Chưa có mô tả.</p>' }}
              />
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Sản phẩm tương tự</h2>
            <div className={styles.relatedGrid}>
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i}/>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ── Skeleton ── */
function ProductDetailSkeleton() {
  return (
    <div style={{ padding: '40px 80px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div style={{ aspectRatio: '1', background: '#e8e5df', borderRadius: 16, animation: 'shimmer 1.5s infinite',
          backgroundImage: 'linear-gradient(90deg,#e8e5df 25%,#f5f4f0 50%,#e8e5df 75%)', backgroundSize: '200% 100%' }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[40, 80, 56, 120, 200, 160].map((h, i) => (
            <div key={i} style={{ height: h, background: '#e8e5df', borderRadius: 8, width: i === 0 ? '30%' : i === 2 ? '60%' : '100%',
              animation: 'shimmer 1.5s infinite', backgroundImage: 'linear-gradient(90deg,#e8e5df 25%,#f5f4f0 50%,#e8e5df 75%)', backgroundSize: '200% 100%' }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Icons ── */
function CartIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" x2="21" y1="6" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
