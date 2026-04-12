/**
 * HeroSlider.jsx  —  Banner slider Apple-style
 * - Auto-play với smooth transition
 * - Dots navigation
 * - Full-width, gradient overlay
 * - CTA button với hover effect
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSlider.module.css';

const SLIDES = [
  {
    id: 1,
    tag:     'Mới nhất 2024',
    title:   'MacBook Pro M3',
    subtitle: 'Chip M3 Pro · 18GB RAM · Pin 22 giờ',
    description: 'Hiệu năng vượt trội, thiết kế thanh lịch. Dành cho những người tạo ra sự khác biệt.',
    price:   '42.990.000₫',
    cta:     'Khám phá ngay',
    href:    '/products?brand=apple&model=macbook-pro',
    bg:      'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
    accentColor: '#a8c5f0',
    imgAlt:  'MacBook Pro M3',
    imgUrl:  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&q=80',
    align:   'left',
  },
  {
    id: 2,
    tag:     'Gaming Beast',
    title:   'ASUS ROG Strix',
    subtitle: 'RTX 4090 · i9-13980HX · 32GB RAM',
    description: 'Chinh phục mọi tựa game. Màn hình 240Hz, hiệu suất không giới hạn.',
    price:   '75.000.000₫',
    cta:     'Trải nghiệm sức mạnh',
    href:    '/products?brand=asus&category=gaming',
    bg:      'linear-gradient(135deg, #0d0d0d 0%, #1a0a2e 50%, #2d1b69 100%)',
    accentColor: '#b76cff',
    imgAlt:  'ASUS ROG Strix',
    imgUrl:  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=700&q=80',
    align:   'right',
  },
  {
    id: 3,
    tag:     'Hot Deal',
    title:   'Dell XPS 15',
    subtitle: 'Intel Core Ultra 9 · OLED 3.5K · 1TB SSD',
    description: 'Màn hình OLED chuẩn Hiệu màu DCI-P3. Thiết kế nhôm nguyên khối cao cấp.',
    price:   '55.990.000₫',
    oldPrice:'65.000.000₫',
    cta:     'Xem ưu đãi',
    href:    '/products?brand=dell&series=xps',
    bg:      'linear-gradient(135deg, #1c1f26 0%, #2d3a2e 50%, #1a2e1a 100%)',
    accentColor: '#6fcf97',
    imgAlt:  'Dell XPS 15',
    imgUrl:  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80',
    align:   'left',
  },
];

export default function HeroSlider() {
  const [current,   setCurrent]   = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAnimating, setAnimating] = useState(false);
  const intervalRef = useRef(null);

  const goTo = useCallback((idx) => {
    if (isAnimating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length);
  }, [current, goTo]);

  /* Auto-play */
  useEffect(() => {
    if (!isPlaying) return;
    intervalRef.current = setInterval(next, 5500);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, next]);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const slide = SLIDES[current];

  return (
    <section
      className={styles.hero}
      style={{ background: slide.bg }}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background image */}
      <div className={styles.bgImage} key={slide.id}>
        <img src={slide.imgUrl} alt={slide.imgAlt} className={styles.bgImg}/>
        <div className={styles.bgOverlay}/>
      </div>

      {/* Content */}
      <div className={styles.container}>
        <div className={`${styles.content} ${slide.align === 'right' ? styles.contentRight : ''}`} key={`content-${slide.id}`}>
          <span className={styles.tag} style={{ color: slide.accentColor, borderColor: slide.accentColor }}>
            {slide.tag}
          </span>

          <h1 className={styles.title}>{slide.title}</h1>

          <p className={styles.subtitle}>{slide.subtitle}</p>

          <p className={styles.description}>{slide.description}</p>

          <div className={styles.priceRow}>
            <span className={styles.price}>{slide.price}</span>
            {slide.oldPrice && (
              <span className={styles.oldPrice}>{slide.oldPrice}</span>
            )}
          </div>

          <Link to={slide.href} className={styles.cta} style={{ '--accent': slide.accentColor }}>
            {slide.cta}
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      {isPlaying && (
        <div className={styles.progressBar} key={`progress-${current}`}>
          <div className={styles.progressFill} style={{ animationDuration: '5.5s' }}/>
        </div>
      )}

      {/* Navigation dots */}
      <div className={styles.dots}>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Slide trước">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Slide tiếp">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </section>
  );
}
