/**
 * CartDrawer.jsx  —  Giỏ hàng slide-in từ phải
 * - Hiển thị danh sách sản phẩm
 * - Thay đổi số lượng / xóa item
 * - Tổng tiền & nút checkout
 * - Overlay backdrop
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store';
import { formatCurrency } from '../../utils/format';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const {
    items, totalItems, totalAmount,
    isOpen, closeDrawer,
    updateItem, removeItem,
    isLoading,
  } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={closeDrawer} />

      {/* Drawer */}
      <aside className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Giỏ hàng</h2>
            {totalItems > 0 && (
              <span className={styles.itemCount}>{totalItems} sản phẩm</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={closeDrawer} aria-label="Đóng giỏ hàng">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className={styles.items}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}/>
            </div>
          ) : items.length === 0 ? (
            <EmptyCart onClose={closeDrawer} />
          ) : (
            items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        {/* Footer - chỉ hiện khi có sản phẩm */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span className={styles.subtotalLabel}>Tạm tính</span>
              <span className={styles.subtotalAmount}>{formatCurrency(totalAmount)}</span>
            </div>
            <p className={styles.shippingNote}>Phí vận chuyển sẽ tính khi checkout</p>

            <Link to="/checkout" className={styles.checkoutBtn} onClick={closeDrawer}>
              Tiến hành thanh toán
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>

            <Link to="/cart" className={styles.viewCartBtn} onClick={closeDrawer}>
              Xem giỏ hàng
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

/* ── CartItem ── */
function CartItem({ item, onUpdate, onRemove }) {
  const [isUpdating, setUpdating] = React.useState(false);

  const handleQty = async (newQty) => {
    setUpdating(true);
    await onUpdate(item.productId, newQty);
    setUpdating(false);
  };

  return (
    <div className={styles.item}>
      <div className={styles.itemImage}>
        <img src={item.image || '/placeholder-laptop.jpg'} alt={item.name} />
      </div>

      <div className={styles.itemInfo}>
        <Link
          to={`/products/${item.slug}`}
          className={styles.itemName}
        >
          {item.name}
        </Link>
        <p className={styles.itemPrice}>{formatCurrency(item.price)}</p>

        <div className={styles.itemActions}>
          {/* Quantity control */}
          <div className={`${styles.qtyControl} ${isUpdating ? styles.qtyUpdating : ''}`}>
            <button
              className={styles.qtyBtn}
              onClick={() => handleQty(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
            >
              −
            </button>
            <span className={styles.qtyValue}>{item.quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => handleQty(item.quantity + 1)}
              disabled={isUpdating}
            >
              +
            </button>
          </div>

          {/* Total */}
          <span className={styles.itemTotal}>
            {formatCurrency(item.price * item.quantity)}
          </span>

          {/* Remove */}
          <button
            className={styles.removeBtn}
            onClick={() => onRemove(item.productId)}
            aria-label="Xóa sản phẩm"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Empty state ── */
function EmptyCart({ onClose }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>
        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" x2="21" y1="6" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      </div>
      <p className={styles.emptyTitle}>Giỏ hàng trống</p>
      <p className={styles.emptySubtitle}>Hãy thêm sản phẩm vào giỏ để bắt đầu</p>
      <Link to="/products" className={styles.emptyBtn} onClick={onClose}>
        Mua sắm ngay
      </Link>
    </div>
  );
}
