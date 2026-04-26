import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  LayoutDashboard, Package, ShoppingBag, Users, LogOut,
  TrendingUp, DollarSign, ShoppingCart, Star, Plus, Edit2,
  Trash2, Search, ChevronDown, BarChart2, Eye
} from 'lucide-react'
import { selectUser, logout } from '../../store/authSlice'
import { laptops, mockOrders } from '../../data/laptops'
import { formatPrice, formatDate, getStatusLabel } from '../../utils'
import toast from 'react-hot-toast'
import styles from './Admin.module.css'

// ── SIDEBAR ──
function AdminSidebar() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    toast.success('Đã đăng xuất')
  }

  const navItems = [
    { to: '/admin', label: 'Tổng quan', icon: <LayoutDashboard size={17} />, end: true },
    { to: '/admin/products', label: 'Sản phẩm', icon: <Package size={17} /> },
    { to: '/admin/orders', label: 'Đơn hàng', icon: <ShoppingBag size={17} /> },
    { to: '/admin/users', label: 'Người dùng', icon: <Users size={17} /> },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <Link to="/">⚡ TechLap</Link>
        <span className={styles.adminBadge}>Admin</span>
      </div>

      <nav className={styles.sidebarNav}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.sidebarUser}>
        <div className={styles.sidebarAvatar}>{user?.name?.[0]}</div>
        <div>
          <div className={styles.sidebarUserName}>{user?.name}</div>
          <div className={styles.sidebarUserRole}>Quản trị viên</div>
        </div>
        <button className={styles.sidebarLogout} onClick={handleLogout}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}

// ── STATS CARD ──
function StatCard({ label, value, icon, trend, color = 'primary' }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <span className={styles.statLabel}>{label}</span>
        <div className={styles.statIcon} style={{ background: `var(--color-${color}-light)`, color: `var(--color-${color})` }}>
          {icon}
        </div>
      </div>
      <div className={styles.statValue}>{value}</div>
      {trend && <div className={styles.statTrend}><TrendingUp size={12} /> {trend}</div>}
    </div>
  )
}

// ── DASHBOARD HOME ──
export function AdminHome() {
  const totalRevenue = mockOrders.reduce((s, o) => s + o.total, 0)

  return (
    <div className={styles.adminContent}>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Tổng quan</h1>
        <span className={styles.contentDate}>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Doanh thu tháng" value={formatPrice(totalRevenue)} icon={<DollarSign size={20} />} trend="+12% so với tháng trước" color="primary" />
        <StatCard label="Tổng đơn hàng" value={mockOrders.length} icon={<ShoppingBag size={20} />} trend="+5 đơn hôm nay" color="success" />
        <StatCard label="Sản phẩm" value={laptops.length} icon={<Package size={20} />} trend="3 sản phẩm mới" color="warning" />
        <StatCard label="Người dùng" value="1,284" icon={<Users size={20} />} trend="+48 tuần này" color="primary" />
      </div>

      <div className={styles.recentGrid}>
        <div className={styles.recentCard}>
          <h3 className={styles.recentTitle}>Đơn hàng gần đây</h3>
          <div className={styles.recentList}>
            {mockOrders.map(order => {
              const status = getStatusLabel(order.status)
              return (
                <div key={order.id} className={styles.recentRow}>
                  <div>
                    <div className={styles.recentId}>#{order.id}</div>
                    <div className={styles.recentSub}>{formatDate(order.date)}</div>
                  </div>
                  <span className={`badge badge-${status.color}`}>{status.label}</span>
                  <div className={styles.recentPrice}>{formatPrice(order.total)}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.recentCard}>
          <h3 className={styles.recentTitle}>Top sản phẩm bán chạy</h3>
          <div className={styles.recentList}>
            {laptops.sort((a, b) => b.sold - a.sold).slice(0, 5).map((p, i) => (
              <div key={p.id} className={styles.recentRow}>
                <div className={styles.rankNum}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.recentId} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div className={styles.recentSub}>{p.sold.toLocaleString()} đã bán</div>
                </div>
                <div className={styles.recentPrice}>{formatPrice(p.price)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── PRODUCTS MANAGEMENT ──
export function AdminProducts() {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState(laptops)

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success('Đã xóa sản phẩm')
    }
  }

  return (
    <div className={styles.adminContent}>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Quản lý sản phẩm</h1>
        <button className="btn btn-primary btn-sm">
          <Plus size={15} /> Thêm sản phẩm
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableSearch}>
            <Search size={15} />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className={styles.tableCount}>{filtered.length} sản phẩm</span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Hãng</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Đã bán</th>
                <th>Đánh giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.productCell}>
                      <img src={p.image} alt={p.name} className={styles.productThumb} />
                      <span className={styles.productName}>{p.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{p.brand.toUpperCase()}</span></td>
                  <td className={styles.priceCell}>{formatPrice(p.price)}</td>
                  <td>
                    <span className={`badge ${p.stock > 10 ? 'badge-success' : 'badge-danger'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>{p.sold.toLocaleString()}</td>
                  <td>⭐ {p.rating}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link to={`/products/${p.id}`} className="btn btn-ghost btn-sm btn-icon" title="Xem">
                        <Eye size={14} />
                      </Link>
                      <button className="btn btn-secondary btn-sm btn-icon" title="Sửa">
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm btn-icon" title="Xóa" onClick={() => handleDelete(p.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── ORDERS MANAGEMENT ──
export function AdminOrders() {
  const statusOptions = ['all', 'pending', 'processing', 'shipping', 'delivered', 'cancelled']
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? mockOrders : mockOrders.filter(o => o.status === filter)

  return (
    <div className={styles.adminContent}>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Quản lý đơn hàng</h1>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.statusTabs}>
            {statusOptions.map(s => {
              const label = s === 'all' ? 'Tất cả' : getStatusLabel(s).label
              return (
                <button
                  key={s}
                  className={`${styles.statusTab} ${filter === s ? styles.statusTabActive : ''}`}
                  onClick={() => setFilter(s)}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const status = getStatusLabel(order.status)
                return (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>{formatDate(order.date)}</td>
                    <td>{order.items[0]?.name.slice(0, 30)}...</td>
                    <td className={styles.priceCell}>{formatPrice(order.total)}</td>
                    <td><span className={`badge badge-${status.color}`}>{status.label}</span></td>
                    <td>
                      <div className={styles.actions}>
                        <button className="btn btn-secondary btn-sm">Chi tiết</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── USERS MANAGEMENT ──
export function AdminUsers() {
  const mockUsers = [
    { id: 1, name: 'Admin TechLap', email: 'admin@techlap.vn', role: 'admin', orders: 0, joined: '2024-01-01' },
    { id: 2, name: 'Nguyễn Văn A', email: 'nva@gmail.com', role: 'user', orders: 3, joined: '2024-02-15' },
    { id: 3, name: 'Trần Thị B', email: 'ttb@gmail.com', role: 'user', orders: 1, joined: '2024-03-01' },
    { id: 4, name: 'Lê Hoàng C', email: 'lhc@gmail.com', role: 'user', orders: 5, joined: '2024-01-20' },
  ]

  return (
    <div className={styles.adminContent}>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Quản lý người dùng</h1>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Đơn hàng</th>
                <th>Ngày tham gia</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary), #6B9EFF)',
                        color: 'white', fontWeight: 700, fontSize: 13,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {u.name[0]}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                      {u.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>{u.orders}</td>
                  <td>{formatDate(u.joined)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className="btn btn-secondary btn-sm btn-icon"><Edit2 size={14} /></button>
                      {u.role !== 'admin' && (
                        <button className="btn btn-danger btn-sm btn-icon"><Trash2 size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── MAIN ADMIN LAYOUT ──
export default function AdminDashboard() {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.adminMain}>
        <Outlet />
      </main>
    </div>
  )
}
