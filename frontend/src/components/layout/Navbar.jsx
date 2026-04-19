import { useState, useCallback } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, Search, Moon, Sun, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { selectCartCount } from '../../store/cartSlice'
import { selectIsAuthenticated, selectUser, selectIsAdmin, logout } from '../../store/authSlice'
import { useTheme } from '../../context/ThemeContext'
import { useScrollTop, useDebounce, useClickOutside } from '../../hooks'
import toast from 'react-hot-toast'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const cartCount = useSelector(selectCartCount)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const isAdmin = useSelector(selectIsAdmin)
  const { theme, toggleTheme } = useTheme()
  const scrolled = useScrollTop()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userMenuRef = useClickOutside(() => setUserMenuOpen(false))

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`)
      setSearchOpen(false)
      setSearchVal('')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Đã đăng xuất')
    navigate('/')
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>TechLap</span>
        </Link>

        {/* Nav Links */}
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} end>
            Trang chủ
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            Sản phẩm
          </NavLink>
          {['Dell', 'Asus', 'Apple', 'HP', 'Lenovo'].map(b => (
            <NavLink key={b} to={`/products?brand=${b.toLowerCase()}`} className={styles.navLink}>
              {b}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Search */}
          <div className={styles.searchWrap}>
            {searchOpen ? (
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                  autoFocus
                  type="text"
                  placeholder="Tìm laptop..."
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  className={styles.searchInput}
                />
                <button type="button" onClick={() => setSearchOpen(false)} className={styles.iconBtn}>
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button className={styles.iconBtn} onClick={() => setSearchOpen(true)} aria-label="Search">
                <Search size={18} />
              </button>
            )}
          </div>

          {/* Theme Toggle */}
          <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Cart */}
          <Link to="/cart" className={styles.cartBtn} aria-label="Cart">
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount > 99 ? '99+' : cartCount}</span>}
          </Link>

          {/* User */}
          {isAuthenticated ? (
            <div className={styles.userMenu} ref={userMenuRef}>
              <button
                className={styles.userBtn}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className={styles.avatar}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className={styles.userName}>{user?.name?.split(' ').pop()}</span>
                <ChevronDown size={14} />
              </button>

              {userMenuOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownAvatar}>{user?.name?.[0]?.toUpperCase()}</div>
                    <div>
                      <div className={styles.dropdownName}>{user?.name}</div>
                      <div className={styles.dropdownEmail}>{user?.email}</div>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link to="/profile" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                    <User size={15} /> Tài khoản
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={15} /> Quản trị
                    </Link>
                  )}
                  <div className={styles.dropdownDivider} />
                  <button className={`${styles.dropdownItem} ${styles.dropdownDanger}`} onClick={handleLogout}>
                    <LogOut size={15} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Đăng nhập</Link>
          )}

          {/* Mobile Menu Btn */}
          <button className={`${styles.iconBtn} ${styles.mobileMenuBtn}`} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileSearch}>
            <form onSubmit={handleSearch}>
              <div className={styles.mobileSearchInner}>
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Tìm laptop..."
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                />
              </div>
            </form>
          </div>
          <nav className={styles.mobileNav}>
            {[
              { to: '/', label: 'Trang chủ' },
              { to: '/products', label: 'Tất cả sản phẩm' },
              { to: '/products?brand=apple', label: 'Apple' },
              { to: '/products?brand=dell', label: 'Dell' },
              { to: '/products?brand=asus', label: 'ASUS' },
              { to: '/products?brand=hp', label: 'HP' },
              { to: '/products?brand=lenovo', label: 'Lenovo' },
              { to: '/cart', label: `Giỏ hàng (${cartCount})` },
            ].map(item => (
              <NavLink key={item.to} to={item.to} className={styles.mobileNavLink}
                onClick={() => setMobileOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <Link to="/login" className={`btn btn-primary ${styles.mobileLoginBtn}`}
                onClick={() => setMobileOpen(false)}>
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
