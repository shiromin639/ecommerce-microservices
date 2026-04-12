/**
 * ProductListPage.jsx  —  Trang danh sách sản phẩm
 * - Grid 4 cột (desktop) / 2 cột (tablet) / 1 cột (mobile)
 * - Sidebar filter bên trái
 * - Dropdown sort + tổng số kết quả
 * - Pagination
 * - Empty state
 */

import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard, { ProductCardSkeleton } from '../components/product/ProductCard';
import ProductFilter from '../components/product/ProductFilter';
import { useProducts } from '../hooks/useProducts';
import styles from './ProductListPage.module.css';

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Mới nhất'       },
  { value: 'popular',   label: 'Phổ biến nhất'  },
  { value: 'price-asc', label: 'Giá thấp → cao' },
  { value: 'price-desc',label: 'Giá cao → thấp' },
];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, pagination, loading, error } = useProducts();

  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = Number(searchParams.get('page') || 1);
  const searchQuery = searchParams.get('q') || '';

  const setSort = (val) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', val);
    next.delete('page');
    setSearchParams(next);
  };

  const setPage = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', page);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Page title */
  const pageTitle = searchQuery
    ? `Kết quả tìm kiếm: "${searchQuery}"`
    : searchParams.get('category')
      ? CATEGORY_LABELS[searchParams.get('category')] || 'Sản phẩm'
      : searchParams.get('brand')
        ? `Laptop ${capitalize(searchParams.get('brand'))}`
        : 'Tất cả Laptop';

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── BREADCRUMB ── */}
        <nav className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>Trang chủ</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{pageTitle}</span>
        </nav>

        <div className={styles.layout}>
          {/* ── FILTER SIDEBAR ── */}
          <ProductFilter />

          {/* ── MAIN CONTENT ── */}
          <div className={styles.main}>

            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                <h1 className={styles.title}>{pageTitle}</h1>
                {pagination && !loading && (
                  <span className={styles.resultCount}>
                    {pagination.total.toLocaleString('vi-VN')} sản phẩm
                  </span>
                )}
              </div>

              <div className={styles.toolbarRight}>
                {/* Mobile filter button (rendered inside ProductFilter) */}
                <ProductFilter />

                <div className={styles.sortWrap}>
                  <label className={styles.sortLabel}>Sắp xếp:</label>
                  <select
                    className={styles.sortSelect}
                    value={currentSort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Error state */}
            {error && (
              <div className={styles.errorBox}>
                <p>⚠️ {error}</p>
                <button className={styles.retryBtn} onClick={() => window.location.reload()}>
                  Thử lại
                </button>
              </div>
            )}

            {/* Product grid */}
            {!error && (
              <div className={styles.grid}>
                {loading
                  ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i}/>)
                  : products.length > 0
                    ? products.map((p, i) => <ProductCard key={p.id} product={p} index={i}/>)
                    : <EmptyState query={searchQuery}/>
                }
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && !loading && (
              <Pagination
                current={currentPage}
                total={pagination.totalPages}
                onPage={setPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Pagination ── */
function Pagination({ current, total, onPage }) {
  const pages = buildPageArray(current, total);
  return (
    <nav className={styles.pagination}>
      <button
        className={styles.pageBtn}
        onClick={() => onPage(current - 1)}
        disabled={current <= 1}
      >
        ‹ Trước
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`dot-${i}`} className={styles.pageDots}>…</span>
        ) : (
          <button
            key={p}
            className={`${styles.pageBtn} ${p === current ? styles.pageBtnActive : ''}`}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className={styles.pageBtn}
        onClick={() => onPage(current + 1)}
        disabled={current >= total}
      >
        Sau ›
      </button>
    </nav>
  );
}

/* ── Empty state ── */
function EmptyState({ query }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>🔍</div>
      <h3 className={styles.emptyTitle}>
        {query ? `Không tìm thấy kết quả cho "${query}"` : 'Không có sản phẩm nào'}
      </h3>
      <p className={styles.emptyDesc}>Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
      <Link to="/products" className={styles.emptyBtn}>Xem tất cả sản phẩm</Link>
    </div>
  );
}

/* ── Helpers ── */
function buildPageArray(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3)             pages.push('…');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2)     pages.push('…');
  pages.push(total);
  return pages;
}

const capitalize = (str) => str ? str[0].toUpperCase() + str.slice(1) : '';

const CATEGORY_LABELS = {
  macbook:   'MacBook',
  gaming:    'Laptop Gaming',
  office:    'Laptop Văn Phòng',
  ultrabook: 'Laptop Mỏng Nhẹ',
};
