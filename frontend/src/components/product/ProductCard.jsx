import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react'
import { addToCart } from '../../store/cartSlice'
import { useWishlist } from '../../hooks'
import { formatPrice } from '../../utils'
import toast from 'react-hot-toast'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch()
  const { toggle, isWished } = useWishlist()
  const wished = isWished(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart(product))
    toast.success(`Đã thêm ${product.name.slice(0, 30)}... vào giỏ hàng`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(product.id)
    toast(wished ? 'Đã xóa khỏi yêu thích' : '❤️ Đã thêm vào yêu thích')
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className={styles.card}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Badges */}
      <div className={styles.badges}>
        {product.isNew && <span className={`badge badge-primary ${styles.badge}`}>Mới</span>}
        {product.isFlashSale && (
          <span className={`badge badge-danger ${styles.badge}`}>
            <Zap size={10} /> Sale
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        className={`${styles.wishBtn} ${wished ? styles.wished : ''}`}
        onClick={handleWishlist}
        aria-label="Wishlist"
      >
        <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
      </button>

      {/* Image */}
      <div className={styles.imageWrap}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.imageOverlay}>
          <button className={styles.quickAdd} onClick={handleAddToCart}>
            <ShoppingCart size={15} />
            Thêm vào giỏ
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.brand}>{product.brand.toUpperCase()}</div>
        <h3 className={styles.name}>{product.name}</h3>

        {/* Specs Pills */}
        <div className={styles.specPills}>
          <span className={styles.pill}>{product.specs.cpu.split(' ').slice(0, 3).join(' ')}</span>
          <span className={styles.pill}>{product.specs.ram}</span>
          <span className={styles.pill}>{product.specs.storage}</span>
        </div>

        {/* Rating */}
        <div className={styles.meta}>
          <div className={styles.rating}>
            <Star size={12} fill="currentColor" className={styles.starIcon} />
            <span>{product.rating}</span>
            <span className={styles.reviews}>({product.reviews})</span>
          </div>
          <span className={styles.sold}>Đã bán {product.sold.toLocaleString()}</span>
        </div>

        {/* Price */}
        <div className={styles.pricing}>
          <span className={`price-current ${styles.price}`}>
            {formatPrice(product.price)}
          </span>
          {product.discount > 0 && (
            <div className={styles.discountRow}>
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
              <span className="price-discount">-{product.discount}%</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
