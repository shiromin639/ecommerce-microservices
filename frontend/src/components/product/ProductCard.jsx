/**
 * ProductCard.jsx  —  Thẻ sản phẩm kiểu Apple Store
 * - Hover effect: image scale + shadow
 * - Hiển thị: ảnh, tên, cấu hình tóm tắt, giá, badge
 * - Quick add to cart button xuất hiện khi hover
 * - Skeleton loading state
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store';
import { formatCurrency } from '../../utils/format';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, index = 0 }) {
  const [isAdding, setIsAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCartStore();

  if (!product) return <ProductCardSkeleton />;

  const {
    id, slug, name, brand, price, salePrice,
    images, specs, isFeatured, isHotDeal, stock,
  } = product;

  const discountPercent = salePrice
    ? Math.round((1 - salePrice / price) * 100)
    : null;

  const displayPrice = salePrice || price;
  const thumbnail    = imgError ? '/placeholder-laptop.jpg' : (images?.[0] || '/placeholder-laptop.jpg');

  const handleAddToCart = async (e) => {
    e.preventDefault();   // Không navigate
    e.stopPropagation();
    if (isAdding || stock === 0) return;
    setIsAdding(true);
    await addItem(id);
    setIsAdding(false);
  };

  // Tóm tắt cấu hình để hiển thị dưới tên
  const specSummary = [
    specs?.cpu  && specs.cpu.split(' ').slice(0, 3).join(' '),
    specs?.ram  && `${specs.ram} RAM`,
    specs?.ssd  && `${specs.ssd} SSD`,
  ].filter(Boolean).join(' · ');

  return (
    <Link
      to={`/products/${slug}`}
      className={styles.card}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* ── BADGES ── */}
      <div className={styles.badges}>
        {isHotDeal && <span className={`${styles.badge} ${styles.badgeHot}`}>Hot Deal</span>}
        {isFeatured && !isHotDeal && <span className={`${styles.badge} ${styles.badgeNew}`}>Nổi bật</span>}
        {discountPercent && (
          <span className={`${styles.badge} ${styles.badgeSale}`}>-{discountPercent}%</span>
        )}
        {stock === 0 && <span className={`${styles.badge} ${styles.badgeOut}`}>Hết hàng</span>}
      </div>

      {/* ── IMAGE ── */}
      <div className={styles.imageWrap}>
        <img
          src={thumbnail}
          alt={name}
          className={styles.image}
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Quick add button */}
        <button
          className={`${styles.quickAdd} ${stock === 0 ? styles.quickAddDisabled : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding || stock === 0}
          aria-label={stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
        >
          {isAdding ? (
            <span className={styles.spinner}/>
          ) : stock === 0 ? (
            'Hết hàng'
          ) : (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Thêm vào giỏ
            </>
          )}
        </button>
      </div>

      {/* ── INFO ── */}
      <div className={styles.info}>
        <p className={styles.brand}>{brand}</p>
        <h3 className={styles.name}>{name}</h3>

        {specSummary && (
          <p className={styles.specs}>{specSummary}</p>
        )}

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatCurrency(displayPrice)}</span>
          {salePrice && (
            <span className={styles.originalPrice}>{formatCurrency(price)}</span>
          )}
        </div>

        {/* Stock indicator */}
        {stock > 0 && stock <= 5 && (
          <p className={styles.lowStock}>Chỉ còn {stock} sản phẩm</p>
        )}
      </div>
    </Link>
  );
}

/* ── SKELETON ── */
export function ProductCardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.skeletonImage} ${styles.shimmer}`}/>
      <div className={styles.skeletonInfo}>
        <div className={`${styles.skeletonLine} ${styles.shimmer}`} style={{ width: '40%', height: 12 }}/>
        <div className={`${styles.skeletonLine} ${styles.shimmer}`} style={{ width: '80%', height: 18 }}/>
        <div className={`${styles.skeletonLine} ${styles.shimmer}`} style={{ width: '60%', height: 12 }}/>
        <div className={`${styles.skeletonLine} ${styles.shimmer}`} style={{ width: '45%', height: 20 }}/>
      </div>
    </div>
  );
}
