'use client';

import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

interface HamburgerMenuProps {
  menuItems: Array<{ name: string; href: string }>;
  onCloseMenu: () => void;
}

export default function HamburgerMenu({ menuItems, onCloseMenu }: HamburgerMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  const closeTimeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const handleClose = () => {
    setIsClosing(true);
    closeTimeoutsRef.current.forEach(clearTimeout);
    closeTimeoutsRef.current = [];

    // Wait for transition to complete before unmounting
    const finalTimeout = setTimeout(() => {
      onCloseMenu();
      setIsClosing(false);
    }, 300); // Match transition duration

    closeTimeoutsRef.current.push(finalTimeout);
  };

  // Ensure menuItems is an array
  const safeMenuItems = Array.isArray(menuItems) && menuItems.length > 0 
    ? menuItems 
    : [
        { name: 'Home', href: '/' },
        { name: 'Artists', href: '/#our-artists' },
        { name: 'About Us', href: '/#about-granville-tattoo' },
        { name: 'Blogs', href: '/blogs' }
      ];

  const menuContent = (
    <nav 
      className={`mobile-nav active ${isClosing ? 'closing' : ''}`}
      onClick={(e) => {
        // Close menu when clicking on background (nav element itself)
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      style={{
        display: 'block',
        visibility: 'visible',
        opacity: isClosing ? 0 : 1,
        transform: isClosing ? 'translateY(-20px)' : 'translateY(0)',
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(5, 5, 5, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)',
        overflow: 'auto',
        cursor: 'pointer',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}
    >
      <div
        onClick={(e) => {
          // Prevent closing when clicking on menu content
          e.stopPropagation();
        }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          cursor: 'default'
        }}
      >
      {/* Close Button */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10000,
          padding: 0,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 107, 53, 0.2)';
          e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
        aria-label="Close menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: '#ffffff' }}
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <ul style={{
        listStyle: 'none',
        margin: '0 auto',
        padding: '120px 0 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        visibility: 'visible',
        opacity: isClosing ? 0 : 1,
        transform: isClosing ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s'
      }}>
        {safeMenuItems.map((item, index) => (
          <li 
            key={`${item.href}-${index}`}
            className="menu-item visible"
            style={{ 
              display: 'flex', 
              visibility: 'visible', 
              opacity: 1,
              marginBottom: '24px',
              width: '100%',
              padding: '0 16px',
              boxSizing: 'border-box',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Link 
              href={item.href} 
              onClick={handleClose} 
              style={{ 
                display: 'block', 
                color: '#ffffff',
                fontSize: '1.3rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                padding: '16px 32px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                width: '100%',
                maxWidth: '280px',
                margin: '0 auto',
                textDecoration: 'none'
              }}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </nav>
  );

  // Render menu using Portal to body to avoid parent container issues
  if (!mounted) return null;
  
  return createPortal(menuContent, document.body);
}
