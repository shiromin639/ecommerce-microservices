import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span>⚡</span> TechLap
            </Link>
            <p className={styles.desc}>
              Hệ thống bán laptop uy tín hàng đầu Việt Nam. Cam kết chính hãng 100%, bảo hành tận nơi.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.social}><Facebook size={18} /></a>
              <a href="#" className={styles.social}><Youtube size={18} /></a>
              <a href="#" className={styles.social}><Instagram size={18} /></a>
            </div>
          </div>

          {/* Products */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Sản phẩm</h4>
            <ul className={styles.colList}>
              {['Laptop Gaming', 'Laptop Văn phòng', 'Laptop Đồ họa', 'MacBook', 'Ultrabook', 'Laptop Sinh viên'].map(item => (
                <li key={item}><Link to="/products" className={styles.colLink}>{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Thương hiệu</h4>
            <ul className={styles.colList}>
              {['Apple', 'Dell', 'ASUS', 'HP', 'Lenovo', 'MSI', 'Acer'].map(brand => (
                <li key={brand}>
                  <Link to={`/products?brand=${brand.toLowerCase()}`} className={styles.colLink}>{brand}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Liên hệ</h4>
            <ul className={styles.contactList}>
              <li>
                <Phone size={15} />
                <a href="tel:1900599912">1900 599 912</a>
              </li>
              <li>
                <Mail size={15} />
                <a href="mailto:support@techlap.vn">support@techlap.vn</a>
              </li>
              <li>
                <MapPin size={15} />
                <span>123 Nguyễn Văn Linh, Q.7, TP.HCM</span>
              </li>
            </ul>
            <div className={styles.certBadges}>
              <div className={styles.certBadge}>🔒 Thanh toán an toàn</div>
              <div className={styles.certBadge}>✅ Hàng chính hãng</div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2024 TechLap. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link to="#">Chính sách bảo mật</Link>
            <Link to="#">Điều khoản sử dụng</Link>
            <Link to="#">Chính sách đổi trả</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
