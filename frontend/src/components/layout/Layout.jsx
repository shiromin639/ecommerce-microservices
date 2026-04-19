import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar'
import Footer from './Footer'
import styles from './Layout.module.css'

export default function Layout() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={`${styles.main} ${isAdmin ? styles.adminMain : ''}`}>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            boxShadow: 'var(--shadow-lg)',
          },
        }}
      />
    </div>
  )
}
