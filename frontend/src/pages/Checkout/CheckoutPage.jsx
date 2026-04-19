import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircle, CreditCard, Banknote, MapPin, User, Phone } from 'lucide-react'
import { selectCartItems, selectCartTotal, clearCart } from '../../store/cartSlice'
import { orderService } from '../../services/api'
import { formatPrice } from '../../utils'
import toast from 'react-hot-toast'
import styles from './Checkout.module.css'

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: <Banknote size={18} />, desc: 'Trả tiền mặt cho nhân viên giao hàng' },
  { id: 'transfer', label: 'Chuyển khoản ngân hàng', icon: <CreditCard size={18} />, desc: 'Chuyển khoản qua STK hoặc QR Code' },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)

  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' })
  const [payment, setPayment] = useState('cod')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const shipping = total >= 5000000 ? 0 : 150000
  const finalTotal = total + shipping

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên'
    if (!/^[0-9]{10,11}$/.test(form.phone)) e.phone = 'Số điện thoại không hợp lệ'
    if (!form.address.trim()) e.address = 'Vui lòng nhập địa chỉ'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const order = await orderService.create({ items, total: finalTotal, ...form, payment })
      dispatch(clearCart())
      setSuccess(true)
      toast.success('Đặt hàng thành công! 🎉')
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !success) {
    navigate('/cart')
    return null
  }

  if (success) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}><CheckCircle size={56} /></div>
          <h2>Đặt hàng thành công!</h2>
          <p>Cảm ơn bạn đã tin tưởng TechLap. Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.</p>
          <div className={styles.successActions}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>Về trang chủ</button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/profile')}>Xem đơn hàng</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Thanh toán</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.layout}>
            {/* Left: Form */}
            <div className={styles.formSection}>
              {/* Shipping Info */}
              <div className={styles.formCard}>
                <h2 className={styles.cardTitle}>
                  <MapPin size={18} /> Thông tin giao hàng
                </h2>

                <div className="form-group">
                  <label className="form-label">Họ và tên</label>
                  <div className={styles.inputWithIcon}>
                    <User size={16} />
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <div className={styles.inputWithIcon}>
                    <Phone size={16} />
                    <input
                      type="tel"
                      placeholder="0901234567"
                      value={form.phone}
                      onChange={e => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }) }}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Địa chỉ giao hàng</label>
                  <textarea
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    value={form.address}
                    onChange={e => { setForm({ ...form, address: e.target.value }); setErrors({ ...errors, address: '' }) }}
                    className={`form-input ${errors.address ? 'error' : ''}`}
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                  {errors.address && <span className="form-error">{errors.address}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Ghi chú (tùy chọn)</label>
                  <textarea
                    placeholder="Ghi chú cho người giao hàng..."
                    value={form.note}
                    onChange={e => setForm({ ...form, note: e.target.value })}
                    className="form-input"
                    rows={2}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className={styles.formCard}>
                <h2 className={styles.cardTitle}>
                  <CreditCard size={18} /> Phương thức thanh toán
                </h2>
                <div className={styles.paymentOptions}>
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id} className={`${styles.paymentOption} ${payment === m.id ? styles.paymentSelected : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={payment === m.id}
                        onChange={() => setPayment(m.id)}
                        className={styles.radioInput}
                      />
                      <span className={styles.paymentIcon}>{m.icon}</span>
                      <div>
                        <div className={styles.paymentLabel}>{m.label}</div>
                        <div className={styles.paymentDesc}>{m.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className={styles.orderSummary}>
              <h2 className={styles.cardTitle}>Đơn hàng của bạn</h2>

              <div className={styles.orderItems}>
                {items.map(item => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.orderItemImg}>
                      <img src={item.image} alt={item.name} />
                      <span className={styles.orderItemQty}>{item.quantity}</span>
                    </div>
                    <div className={styles.orderItemInfo}>
                      <div className={styles.orderItemName}>{item.name}</div>
                      <div className={styles.orderItemSpec}>{item.specs.ram} · {item.specs.storage}</div>
                    </div>
                    <div className={styles.orderItemPrice}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className={styles.orderTotals}>
                <div className={styles.orderLine}>
                  <span>Tạm tính</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className={styles.orderLine}>
                  <span>Phí ship</span>
                  <span>{shipping === 0 ? <span className={styles.free}>Miễn phí</span> : formatPrice(shipping)}</span>
                </div>
              </div>

              <div className={styles.orderTotal}>
                <span>Tổng thanh toán</span>
                <span className={styles.orderTotalPrice}>{formatPrice(finalTotal)}</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-4)' }}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : `Đặt hàng · ${formatPrice(finalTotal)}`}
              </button>

              <p className={styles.termsNote}>
                Bằng cách đặt hàng, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a> của TechLap.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
