/**
 * Footer.jsx  —  Footer đầy đủ kiểu Apple
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const LINKS = {
  'Sản phẩm': [
    { label: 'MacBook',     href: '/products?category=macbook'   },
    { label: 'Gaming',      href: '/products?category=gaming'    },
    { label: 'Văn phòng',   href: '/products?category=office'    },
    { label: 'Mỏng & Nhẹ', href: '/products?category=ultrabook' },
    { label: 'Hot Deals',   href: '/products?hot=true'           },
  ],
  'Hỗ trợ': [
    { label: 'Hướng dẫn mua hàng', href: '/guide'     },
    { label: 'Chính sách đổi trả', href: '/return'    },
    { label: 'Bảo hành',           href: '/warranty'  },
    { label: 'Tra cứu đơn hàng',   href: '/orders'    },
    { label: 'Liên hệ',            href: '/contact'   },
  ],
  'Công ty': [
    { label: 'Về chúng tôi', href: '/about'   },
    { label: 'Tuyển dụng',   href: '/careers' },
    { label: 'Tin tức',      href: '/news'    },
    { label: 'Đối tác',      href: '/partner' },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* Top */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="7" fill="currentColor"/>
                <path d="M8 20V10l6-3 6 3v10l-6 3-6-3z" fill="white" fillOpacity="0.9"/>
                <path d="M14 7v14M8 10l6 3 6-3" stroke="white" strokeWidth="1.2" strokeOpacity="0.5"/>
              </svg>
              LapStore
            </Link>
            <p className={styles.tagline}>
              Điểm đến tin cậy của mọi laptop chính hãng tại Việt Nam.
            </p>
            <div className={styles.socials}>
              {[
                { label: 'Facebook',  href: '#', icon: 'f' },
                { label: 'Zalo',      href: '#', icon: 'z' },
                { label: 'YouTube',   href: '#', icon: '▶' },
              ].map((s) => (
                <a key={s.label} href={s.href} className={styles.socialIcon} aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>{section}</h4>
              <ul className={styles.linkList}>
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className={styles.footerLink}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copy}>© {new Date().getFullYear()} LapStore. Tất cả quyền được bảo lưu.</p>
          <div className={styles.paymentLogos}>
            {['VNPay', 'ZaloPay', 'Visa', 'MasterCard', 'JCB'].map(p => (
              <span key={p} className={styles.paymentLogo}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
