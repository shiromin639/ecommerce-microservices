/**
 * CheckoutPage.jsx  —  Trang thanh toán
 * - Form thông tin giao hàng
 * - Chọn phương thức thanh toán (VNPay / ZaloPay / COD)
 * - Order summary
 * - Redirect sau khi đặt thành công
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../store';
import { orderAPI, paymentAPI } from '../api';
import { formatCurrency } from '../utils/format';
import styles from './CheckoutPage.module.css';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  {
    id:    'vnpay',
    label: 'VNPay',
    desc:  'Thanh toán qua cổng VNPay (ATM, Visa, QR)',
    icon:  '🏦',
  },
  {
    id:    'zalopay',
    label: 'ZaloPay',
    desc:  'Thanh toán qua ví ZaloPay',
    icon:  '💙',
  },
  {
    id:    'cod',
    label: 'Thanh toán khi nhận hàng (COD)',
    desc:  'Trả tiền mặt khi nhận hàng',
    icon:  '💵',
  },
];

const INITIAL_FORM = {
  fullName:    '',
  phone:       '',
  email:       '',
  province:    '',
  district:    '',
  address:     '',
  note:        '',
};

export default function CheckoutPage() {
  const navigate  = useNavigate();
  const { user }  = useAuthStore();
  const { items, totalAmount, fetchCart } = useCartStore();

  const [form,      setForm]      = useState({
    ...INITIAL_FORM,
    fullName: user?.fullName || '',
    email:    user?.email    || '',
    phone:    user?.phone    || '',
  });
  const [payment,   setPayment]   = useState('vnpay');
  const [errors,    setErrors]    = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* Redirect nếu giỏ hàng trống */
  useEffect(() => {
    if (!items || items.length === 0) {
      navigate('/cart');
    }
  }, [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  /* Validate */
  const validate = () => {
    const errs = {};
    if (!form.fullName.trim())  errs.fullName = 'Vui lòng nhập họ tên';
    if (!form.phone.trim())     errs.phone    = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)[0-9]{9}$/.test(form.phone.trim()))
                                errs.phone    = 'Số điện thoại không hợp lệ';
    if (!form.email.trim())     errs.email    = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(form.email))
                                errs.email    = 'Email không hợp lệ';
    if (!form.province.trim())  errs.province = 'Vui lòng chọn tỉnh/thành';
    if (!form.address.trim())   errs.address  = 'Vui lòng nhập địa chỉ';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    const loadingToast = toast.loading('Đang xử lý đơn hàng...');

    try {
      /* 1. Tạo đơn hàng */
      const orderRes = await orderAPI.checkout({
        shippingName:    form.fullName,
        shippingPhone:   form.phone,
        shippingAddress: `${form.address}, ${form.district}, ${form.province}`,
        shippingNote:    form.note,
        paymentMethod:   payment,
      });

      const order = orderRes.data;
      toast.dismiss(loadingToast);

      /* 2. Xử lý thanh toán */
      if (payment === 'cod') {
        toast.success('Đặt hàng thành công!');
        navigate(`/order-success/${order.id}`);
        return;
      }

      /* 3. Redirect đến cổng thanh toán */
      toast.loading('Đang chuyển đến cổng thanh toán...');

      if (payment === 'vnpay') {
        const payRes = await paymentAPI.createVNPay(
          order.id,
          `${window.location.origin}/order-success/${order.id}`
        );
        window.location.href = payRes.data.paymentUrl;
      } else if (payment === 'zalopay') {
        const payRes = await paymentAPI.createZaloPay(order.id);
        window.location.href = payRes.data.orderUrl;
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Đặt hàng thất bại, vui lòng thử lại');
      setSubmitting(false);
    }
  };

  const shipping     = totalAmount >= 10_000_000 ? 0 : 50_000;
  const finalAmount  = totalAmount + shipping;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>LapStore</Link>
          <div className={styles.steps}>
            <span className={`${styles.step} ${styles.stepDone}`}>1. Giỏ hàng</span>
            <span className={styles.stepArrow}>›</span>
            <span className={`${styles.step} ${styles.stepActive}`}>2. Thanh toán</span>
            <span className={styles.stepArrow}>›</span>
            <span className={styles.step}>3. Hoàn tất</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.layout}>

          {/* ── LEFT: FORM ── */}
          <div className={styles.formCol}>

            {/* Shipping info */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardNum}>1</span>
                Thông tin giao hàng
              </h2>

              <div className={styles.formGrid}>
                <FormField
                  label="Họ và tên *"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  placeholder="Nguyễn Văn An"
                  className={styles.colSpan2}
                />
                <FormField
                  label="Số điện thoại *"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="0912 345 678"
                  type="tel"
                />
                <FormField
                  label="Email *"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="email@example.com"
                  type="email"
                />
                <FormField
                  label="Tỉnh / Thành phố *"
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  error={errors.province}
                  placeholder="Hà Nội"
                />
                <FormField
                  label="Quận / Huyện"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Hoàn Kiếm"
                />
                <FormField
                  label="Địa chỉ cụ thể *"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  error={errors.address}
                  placeholder="Số nhà, tên đường..."
                  className={styles.colSpan2}
                />
                <FormField
                  label="Ghi chú"
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Giao giờ hành chính, gọi trước khi giao..."
                  className={styles.colSpan2}
                  multiline
                />
              </div>
            </div>

            {/* Payment method */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardNum}>2</span>
                Phương thức thanh toán
              </h2>

              <div className={styles.paymentMethods}>
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`${styles.paymentCard} ${payment === method.id ? styles.paymentCardActive : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={payment === method.id}
                      onChange={() => setPayment(method.id)}
                      className={styles.radioInput}
                    />
                    <div className={styles.paymentIcon}>{method.icon}</div>
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentLabel}>{method.label}</span>
                      <span className={styles.paymentDesc}>{method.desc}</span>
                    </div>
                    <div className={`${styles.radioIndicator} ${payment === method.id ? styles.radioChecked : ''}`}/>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <div className={styles.summaryCol}>
            <div className={`${styles.card} ${styles.summaryCard}`}>
              <h2 className={styles.cardTitle}>Đơn hàng của bạn</h2>

              <div className={styles.summaryItems}>
                {items.map((item) => (
                  <div key={item.productId} className={styles.summaryItem}>
                    <div className={styles.summaryItemImg}>
                      <img src={item.image || '/placeholder-laptop.jpg'} alt={item.name}/>
                      <span className={styles.summaryItemQty}>{item.quantity}</span>
                    </div>
                    <div className={styles.summaryItemInfo}>
                      <p className={styles.summaryItemName}>{item.name}</p>
                    </div>
                    <span className={styles.summaryItemPrice}>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryTotals}>
                <div className={styles.totalRow}>
                  <span>Tạm tính</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Vận chuyển</span>
                  <span>{shipping === 0 ? <span className={styles.free}>Miễn phí</span> : formatCurrency(shipping)}</span>
                </div>
                <div className={`${styles.totalRow} ${styles.totalFinal}`}>
                  <span>Tổng cộng</span>
                  <span className={styles.finalAmount}>{formatCurrency(finalAmount)}</span>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
              >
                {submitting ? (
                  <><span className={styles.spinner}/> Đang xử lý...</>
                ) : (
                  <>
                    {payment === 'cod' ? 'Đặt hàng' : `Thanh toán qua ${PAYMENT_METHODS.find(m => m.id === payment)?.label}`}
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>

              <p className={styles.secureNote}>
                🔒 Thông tin được bảo mật 256-bit SSL
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── FormField ── */
function FormField({ label, name, value, onChange, error, placeholder, type = 'text', className = '', multiline = false }) {
  return (
    <div className={`${styles.field} ${className}`}>
      <label className={styles.fieldLabel}>{label}</label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${styles.fieldInput} ${styles.fieldTextarea} ${error ? styles.fieldError : ''}`}
          rows={3}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${styles.fieldInput} ${error ? styles.fieldError : ''}`}
        />
      )}
      {error && <span className={styles.fieldErrorMsg}>{error}</span>}
    </div>
  );
}
