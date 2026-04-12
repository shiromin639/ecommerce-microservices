/**
 * ProductFilter.jsx  —  Sidebar lọc sản phẩm
 * - Lọc theo: Brand, Giá, RAM, SSD, Danh mục
 * - URL params sync (có thể share link bộ lọc)
 * - Mobile: collapse/expand
 */

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './ProductFilter.module.css';

const BRANDS = ['Apple', 'ASUS', 'Dell', 'HP', 'Lenovo', 'MSI', 'Acer', 'LG', 'Microsoft'];
const RAM_OPTIONS = ['8GB', '16GB', '18GB', '32GB', '64GB'];
const SSD_OPTIONS = ['256GB', '512GB', '1TB', '2TB', '4TB'];
const PRICE_RANGES = [
  { label: 'Dưới 15 triệu',         min: 0,          max: 15_000_000 },
  { label: '15 - 25 triệu',          min: 15_000_000, max: 25_000_000 },
  { label: '25 - 40 triệu',          min: 25_000_000, max: 40_000_000 },
  { label: '40 - 60 triệu',          min: 40_000_000, max: 60_000_000 },
  { label: 'Trên 60 triệu',          min: 60_000_000, max: Infinity   },
];
const CATEGORIES = [
  { value: 'macbook',    label: 'MacBook' },
  { value: 'gaming',     label: 'Gaming'  },
  { value: 'office',     label: 'Văn phòng' },
  { value: 'ultrabook',  label: 'Mỏng & Nhẹ' },
];

export default function ProductFilter({ onClose }) {
  const [params, setParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Read current filter values from URL */
  const activeCategory = params.get('category') || '';
  const activeBrands   = params.getAll('brand');
  const activeRam      = params.getAll('ram');
  const activeSsd      = params.getAll('ssd');
  const activeMinPrice = Number(params.get('minPrice') || 0);
  const activeMaxPrice = Number(params.get('maxPrice') || Infinity);

  const updateParam = (key, value, multi = false) => {
    const next = new URLSearchParams(params);
    next.delete('page'); // Reset về trang 1

    if (multi) {
      const existing = next.getAll(key);
      if (existing.includes(value)) {
        // Toggle off
        next.delete(key);
        existing.filter(v => v !== value).forEach(v => next.append(key, v));
      } else {
        next.append(key, value);
      }
    } else {
      if (next.get(key) === value) next.delete(key);
      else next.set(key, value);
    }
    setParams(next);
  };

  const setPriceRange = (min, max) => {
    const next = new URLSearchParams(params);
    next.delete('page');
    const currentMin = Number(next.get('minPrice') || 0);
    const currentMax = Number(next.get('maxPrice') || Infinity);

    if (currentMin === min && currentMax === max) {
      next.delete('minPrice');
      next.delete('maxPrice');
    } else {
      if (min > 0) next.set('minPrice', min);
      else next.delete('minPrice');
      if (max < Infinity) next.set('maxPrice', max);
      else next.delete('maxPrice');
    }
    setParams(next);
  };

  const clearAll = () => {
    const next = new URLSearchParams();
    const q = params.get('q');
    if (q) next.set('q', q);
    setParams(next);
  };

  const hasFilters =
    activeCategory || activeBrands.length || activeRam.length ||
    activeSsd.length || activeMinPrice || activeMaxPrice < Infinity;

  const filterContent = (
    <div className={styles.filters}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.heading}>Bộ lọc</h3>
        {hasFilters && (
          <button className={styles.clearAll} onClick={clearAll}>
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Danh mục">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className={`${styles.chip} ${activeCategory === cat.value ? styles.chipActive : ''}`}
            onClick={() => updateParam('category', cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Thương hiệu">
        <div className={styles.checkList}>
          {BRANDS.map((brand) => (
            <label key={brand} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={activeBrands.includes(brand.toLowerCase())}
                onChange={() => updateParam('brand', brand.toLowerCase(), true)}
                className={styles.checkbox}
              />
              <span className={styles.checkLabel}>{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Mức giá">
        {PRICE_RANGES.map((range) => {
          const isActive = activeMinPrice === range.min && activeMaxPrice === range.max;
          return (
            <button
              key={range.label}
              className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
              onClick={() => setPriceRange(range.min, range.max)}
            >
              {range.label}
            </button>
          );
        })}
      </FilterSection>

      {/* RAM */}
      <FilterSection title="RAM">
        <div className={styles.tagGrid}>
          {RAM_OPTIONS.map((ram) => (
            <button
              key={ram}
              className={`${styles.tag} ${activeRam.includes(ram) ? styles.tagActive : ''}`}
              onClick={() => updateParam('ram', ram, true)}
            >
              {ram}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* SSD */}
      <FilterSection title="Ổ cứng SSD">
        <div className={styles.tagGrid}>
          {SSD_OPTIONS.map((ssd) => (
            <button
              key={ssd}
              className={`${styles.tag} ${activeSsd.includes(ssd) ? styles.tagActive : ''}`}
              onClick={() => updateParam('ssd', ssd, true)}
            >
              {ssd}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className={styles.mobileToggle}>
        <button
          className={styles.mobileBtn}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="14" y2="12"/>
            <line x1="4" y1="18" x2="10" y2="18"/>
          </svg>
          Bộ lọc
          {hasFilters && <span className={styles.filterCount}>!</span>}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className={styles.sidebar}>
        {filterContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)}>
          <div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileHeader}>
              <h3 className={styles.heading}>Bộ lọc</h3>
              <button className={styles.closeBtn} onClick={() => setMobileOpen(false)}>✕</button>
            </div>
            {filterContent}
            <div className={styles.mobileFooter}>
              <button className={styles.applyBtn} onClick={() => setMobileOpen(false)}>
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Filter Section ── */
function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.section}>
      <button className={styles.sectionHeader} onClick={() => setOpen(!open)}>
        <span className={styles.sectionTitle}>{title}</span>
        <svg
          width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"
          viewBox="0 0 24 24"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && <div className={styles.sectionContent}>{children}</div>}
    </div>
  );
}
