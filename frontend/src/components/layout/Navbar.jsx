/**
 * Navbar.jsx  —  Thanh điều hướng Apple-style
 * - Transparent → frosted glass khi scroll
 * - Mega menu cho danh mục
 * - Giỏ hàng indicator
 * - Search overlay
 */

import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useCartStore, useUIStore } from '../../store';
import styles from './Navbar.module.css';

const CATEGORIES = [
  {
    label: 'MacBook',
    href:  '/products?category=macbook',
    items: [
      { name: 'MacBook Air M3',   href: '/products?brand=apple&model=macbook-air',   badge: 'Mới' },
      { name: 'MacBook Pro M3',   href: '/products?brand=apple&model=macbook-pro',   badge: 'Hot' },
      { name: 'MacBook Pro 16"',  href: '/products?brand=apple&model=macbook-pro-16'          },
    ],
  },
  {
    label: 'Gaming',
    href:  '/products?category=gaming',
    items: [
      { name: 'ASUS ROG',    href: '/products?brand=asus&category=gaming'   },
      { name: 'MSI Gaming',  href: '/products?brand=msi&category=gaming'    },
      { name: 'Lenovo Legion', href: '/products?brand=lenovo&category=gaming' },
      { name: 'Acer Nitro',  href: '/products?brand=acer&category=gaming'   },
    ],
  },
  {
    label: 'Văn phòng',
    href:  '/products?category=office',
    items: [
      { name: 'Dell XPS',        href: '/products?brand=dell&series=xps'    },
      { name: 'HP Spectre',      href: '/products?brand=hp&series=spectre'  },
      { name: 'Lenovo ThinkPad', href: '/products?brand=lenovo&series=thinkpad' },
      { name: 'Surface Laptop',  href: '/products?brand=microsoft'          },
    ],
  },
  {
    label: 'Mỏng & Nhẹ',
    href:  '/products?category=ultrabook',
    items: [
      { name: 'Dell Inspiron',   href: '/products?brand=dell&category=ultrabook' },
      { name: 'ASUS ZenBook',    href: '/products?brand=asus&series=zenbook'     },
      { name: 'LG Gram',         href: '/products?brand=lg'                      },
    ],
  },
  { label: 'Hot Deals', href: '/products?hot=true', highlight: true },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout, isAdmin } = useAuthStore();
  const { totalItems, openDrawer } = useCartStore();
  const { isNavScrolled, setNavScrolled, searchQuery, setSearchQuery, isSearchOpen, openSearch, closeSearch } = useUIStore();

  const [activeMenu,  setActiveMenu]  = useState(null);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [localSearch,  setLocalSearch] = useState('');
  const searchRef = useRef(null);
  const menuTimer = useRef(null);

  /* Scroll effect */
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close menu on route change */
  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [location.pathname]);

  /* Search focus */
  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/products?q=${encodeURIComponent(localSearch.trim())}`);
      setLocalSearch('');
      closeSearch();
    }
  };

  const handleMenuEnter = (label) => {
    clearTimeout(menuTimer.current);
    setActiveMenu(label);
  };

  const handleMenuLeave = () => {
    menuTimer.current = setTimeout(() => setActiveMenu(null), 150);
  };

  return (
    <>
      <nav className={`${styles.navbar} ${isNavScrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>

          {/* ── LOGO ── */}
          <Link to="/" className={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="currentColor"/>
              <path d="M8 20V10l6-3 6 3v10l-6 3-6-3z" fill="white" fillOpacity="0.9"/>
              <path d="M14 7v14M8 10l6 3 6-3" stroke="white" strokeWidth="1.2" strokeOpacity="0.5"/>
            </svg>
            <span className={styles.logoText}>LapStore</span>
          </Link>

          {/* ── DESKTOP NAVIGATION ── */}
          <ul className={styles.navLinks}>
            {CATEGORIES.map((cat) => (
              <li
                key={cat.label}
                className={styles.navItem}
                onMouseEnter={() => cat.items && handleMenuEnter(cat.label)}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  to={cat.href}
                  className={`${styles.navLink} ${cat.highlight ? styles.navLinkHighlight : ''}`}
                >
                  {cat.label}
                </Link>

                {/* Mega dropdown */}
                {cat.items && activeMenu === cat.label && (
                  <div
                    className={styles.megaMenu}
                    onMouseEnter={() => handleMenuEnter(cat.label)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <div className={styles.megaMenuInner}>
                      <p className={styles.megaMenuTitle}>{cat.label}</p>
                      <ul className={styles.megaMenuList}>
                        {cat.items.map((item) => (
                          <li key={item.name}>
                            <Link to={item.href} className={styles.megaMenuLink}>
                              {item.name}
                              {item.badge && (
                                <span className={styles.megaBadge}>{item.badge}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link to={cat.href} className={styles.megaViewAll}>
                        Xem tất cả →
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* ── RIGHT ACTIONS ── */}
          <div className={styles.actions}>
            {/* Search */}
            <button className={styles.iconBtn} onClick={openSearch} aria-label="Tìm kiếm">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Cart */}
            <button className={styles.cartBtn} onClick={openDrawer} aria-label="Giỏ hàng">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems > 99 ? '99+' : totalItems}</span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className={styles.userMenu}>
                <button className={styles.avatarBtn}>
                  <span className={styles.avatar}>
                    {user.fullName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </button>
                <div className={styles.userDropdown}>
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>{user.fullName}</p>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                  <div className={styles.userLinks}>
                    <Link to="/orders" className={styles.userLink}>Đơn hàng của tôi</Link>
                    {isAdmin() && (
                      <Link to="/admin" className={styles.userLink}>Quản trị</Link>
                    )}
                    <button onClick={logout} className={styles.logoutBtn}>Đăng xuất</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className={styles.loginBtn}>Đăng nhập</Link>
            )}

            {/* Mobile hamburger */}
            <button
              className={styles.hamburger}
              onClick={() => setMobileOpen(!isMobileOpen)}
              aria-label="Menu"
            >
              <span className={isMobileOpen ? styles.hamLineOpen : ''}/>
              <span className={isMobileOpen ? styles.hamLineHide : ''}/>
              <span className={isMobileOpen ? styles.hamLineOpen2 : ''}/>
            </button>
          </div>
        </div>
      </nav>

      {/* ── SEARCH OVERLAY ── */}
      {isSearchOpen && (
        <div className={styles.searchOverlay} onClick={closeSearch}>
          <div className={styles.searchBox} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Tìm laptop, thương hiệu, cấu hình..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className={styles.searchInput}
              />
              {localSearch && (
                <button type="button" onClick={() => setLocalSearch('')} className={styles.searchClear}>✕</button>
              )}
            </form>
            <div className={styles.searchHints}>
              {['MacBook Pro M3', 'ASUS ROG', 'Dell XPS', 'Gaming 32GB RAM'].map((hint) => (
                <button
                  key={hint}
                  className={styles.searchHint}
                  onClick={() => { setLocalSearch(hint); navigate(`/products?q=${encodeURIComponent(hint)}`); closeSearch(); }}
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE MENU ── */}
      {isMobileOpen && (
        <div className={styles.mobileMenu}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.label} to={cat.href} className={styles.mobileLink}>
              {cat.label}
            </Link>
          ))}
          <hr className={styles.mobileDivider}/>
          {user ? (
            <>
              <span className={styles.mobileName}>Xin chào, {user.fullName}</span>
              <Link to="/orders" className={styles.mobileLink}>Đơn hàng</Link>
              <button onClick={logout} className={styles.mobileLogout}>Đăng xuất</button>
            </>
          ) : (
            <Link to="/login" className={styles.mobileLink}>Đăng nhập / Đăng ký</Link>
          )}
        </div>
      )}

      {/* Spacer */}
      <div style={{ height: 'var(--navbar-height)' }} />
    </>
  );
}
