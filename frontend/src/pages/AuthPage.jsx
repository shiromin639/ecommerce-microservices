/**
 * LoginPage.jsx + RegisterPage.jsx  —  Auth pages
 * Thiết kế hai cột: form bên phải, hình ảnh/quote bên trái
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import styles from './AuthPage.module.css';

/* ══════════════════════════════════════════
   LOGIN PAGE
   ══════════════════════════════════════════ */
export function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isLoading } = useAuthStore();
  const [form,   setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim())    errs.email    = 'Vui lòng nhập email';
    if (!form.password.trim()) errs.password = 'Vui lòng nhập mật khẩu';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await login(form.email, form.password);
    if (result.success) navigate(from, { replace: true });
  };

  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.leftPanel}>
        <Link to="/" className={styles.backHome}>← Trang chủ</Link>
        <div className={styles.leftContent}>
          <blockquote className={styles.quote}>
            "Công nghệ tốt nhất là thứ biến mất — nó hòa vào cuộc sống hàng ngày cho đến khi không thể phân biệt được."
          </blockquote>
          <p className={styles.quoteAuthor}>— Jony Ive</p>
        </div>
        <div className={styles.leftDecor}/>
      </div>

      {/* Right panel — Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrap}>
          <Link to="/" className={styles.logo}>LapStore</Link>

          <h1 className={styles.formTitle}>Đăng nhập</h1>
          <p className={styles.formSubtitle}>
            Chưa có tài khoản?{' '}
            <Link to="/register" className={styles.authLink}>Đăng ký ngay</Link>
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <AuthField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="email@example.com"
              autoFocus
            />

            <div className={styles.passwordWrap}>
              <AuthField
                label="Mật khẩu"
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                className={styles.togglePw}
                onClick={() => setShowPw(!showPw)}
                tabIndex={-1}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
              <Link to="/forgot-password" className={styles.forgotLink}>Quên mật khẩu?</Link>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? <><span className={styles.spinner}/> Đang đăng nhập...</> : 'Đăng nhập'}
            </button>
          </form>

          <div className={styles.divider}><span>hoặc</span></div>

          <button className={styles.socialBtn}>
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Tiếp tục với Google
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   REGISTER PAGE
   ══════════════════════════════════════════ */
export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [form,   setForm]   = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim())     errs.fullName = 'Vui lòng nhập họ tên';
    if (!form.email.trim())        errs.email    = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email không hợp lệ';
    if (form.password.length < 8)  errs.password = 'Mật khẩu ít nhất 8 ký tự';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu không khớp';
    if (!agreed)                   errs.agreed   = 'Vui lòng đồng ý điều khoản';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register({
      fullName: form.fullName,
      email:    form.email,
      password: form.password,
    });
    if (result.success) navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <Link to="/" className={styles.backHome}>← Trang chủ</Link>
        <div className={styles.leftContent}>
          <h2 className={styles.leftTitle}>Gia nhập cộng đồng LapStore</h2>
          <p className={styles.leftDesc}>Hàng nghìn sản phẩm laptop chính hãng, ưu đãi độc quyền và dịch vụ hậu mãi tuyệt vời.</p>
          <ul className={styles.benefitList}>
            {['Ưu đãi thành viên VIP', 'Theo dõi đơn hàng real-time', 'Hỗ trợ 24/7', 'Tích điểm đổi quà'].map(b => (
              <li key={b} className={styles.benefit}>✓ {b}</li>
            ))}
          </ul>
        </div>
        <div className={styles.leftDecor}/>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formWrap}>
          <Link to="/" className={styles.logo}>LapStore</Link>

          <h1 className={styles.formTitle}>Tạo tài khoản</h1>
          <p className={styles.formSubtitle}>
            Đã có tài khoản?{' '}
            <Link to="/login" className={styles.authLink}>Đăng nhập</Link>
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <AuthField label="Họ và tên" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} placeholder="Nguyễn Văn An" autoFocus/>
            <AuthField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="email@example.com"/>

            <div className={styles.passwordWrap}>
              <AuthField label="Mật khẩu" name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} error={errors.password} placeholder="Ít nhất 8 ký tự"/>
              <button type="button" className={styles.togglePw} onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>

            <AuthField label="Xác nhận mật khẩu" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="Nhập lại mật khẩu"/>

            {/* Password strength */}
            {form.password && <PasswordStrength password={form.password}/>}

            <label className={styles.agreeRow}>
              <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(p => ({ ...p, agreed: '' })); }} className={styles.checkbox}/>
              <span className={styles.agreeText}>
                Tôi đồng ý với <Link to="/terms" className={styles.authLink}>Điều khoản dịch vụ</Link> và{' '}
                <Link to="/privacy" className={styles.authLink}>Chính sách bảo mật</Link>
              </span>
            </label>
            {errors.agreed && <span className={styles.errorMsg}>{errors.agreed}</span>}

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? <><span className={styles.spinner}/> Đang tạo tài khoản...</> : 'Tạo tài khoản'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── PasswordStrength indicator ── */
function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ ký tự',              pass: password.length >= 8      },
    { label: 'Chữ hoa',               pass: /[A-Z]/.test(password)    },
    { label: 'Chữ số',                pass: /[0-9]/.test(password)    },
    { label: 'Ký tự đặc biệt',        pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const labels = ['', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const colors = ['', '#e74c3c', '#e67e22', '#2ecc71', '#27ae60'];

  return (
    <div className={styles.strength}>
      <div className={styles.strengthBars}>
        {[1,2,3,4].map(i => (
          <div key={i} className={styles.strengthBar}
               style={{ background: i <= score ? colors[score] : 'var(--color-border)' }}/>
        ))}
      </div>
      <span className={styles.strengthLabel} style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
}

/* ── AuthField ── */
function AuthField({ label, name, type = 'text', value, onChange, error, placeholder, autoFocus }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`${styles.fieldInput} ${error ? styles.fieldError : ''}`}
        autoComplete={type === 'password' ? 'current-password' : name}
      />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}
