/**
 * FloatingContact.jsx  —  Nút liên hệ nổi
 * - Zalo / Messenger / Phone
 * - Expand on click
 * - Tooltip label
 */

import React, { useState } from 'react';
import styles from './FloatingContact.module.css';

const CONTACTS = [
  {
    id:    'phone',
    label: 'Gọi ngay',
    href:  'tel:1900123456',
    color: '#2d7a4f',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.18 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.36-.36a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z"/>
      </svg>
    ),
  },
  {
    id:    'zalo',
    label: 'Chat Zalo',
    href:  'https://zalo.me/0912345678',
    color: '#0068FF',
    icon: (
      <svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor">
        <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-2.6 28.4H14v-1.6l6.2-8.6H14v-1.8h7.4v1.6l-6.2 8.6h6.2v1.8zm5.8 0h-2.2V22h2.2v10.4zm-1.1-12.2a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8zm10.7 12.2h-2l-3.8-6.8v6.8h-2.2V22h2l3.8 6.8V22h2.2v10.4z"/>
      </svg>
    ),
  },
  {
    id:    'messenger',
    label: 'Facebook',
    href:  'https://m.me/laptopstoreVN',
    color: '#0084FF',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.906 1.322 5.497 3.41 7.233v3.524l3.32-1.823c.888.245 1.83.377 2.81.377 5.523 0 10-4.145 10-9.311S17.523 2 12 2zm1.05 12.54l-2.55-2.72-4.98 2.72 5.48-5.82 2.61 2.72 4.92-2.72-5.48 5.82z"/>
      </svg>
    ),
  },
];

export default function FloatingContact() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.container}>
      {/* Contact buttons */}
      <div className={`${styles.buttons} ${expanded ? styles.expanded : ''}`}>
        {CONTACTS.map((contact, i) => (
          <a
            key={contact.id}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactBtn}
            style={{
              '--btn-color': contact.color,
              transitionDelay: expanded ? `${i * 60}ms` : '0ms',
            }}
            aria-label={contact.label}
          >
            <span className={styles.tooltip}>{contact.label}</span>
            <span className={styles.icon} style={{ color: contact.color }}>
              {contact.icon}
            </span>
          </a>
        ))}
      </div>

      {/* Toggle button */}
      <button
        className={`${styles.toggle} ${expanded ? styles.toggleOpen : ''}`}
        onClick={() => setExpanded(!expanded)}
        aria-label="Liên hệ hỗ trợ"
      >
        {expanded ? (
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}

        {/* Pulse ring when collapsed */}
        {!expanded && <span className={styles.pulse}/>}
      </button>
    </div>
  );
}
