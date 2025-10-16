'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import HamburgerMenu from './animations/HamburgerMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if we're on home page
  const isHomePage = pathname === '/';
  
  // Use single artist header for all pages except home
  const isSingleArtistPage = !isHomePage;

  const menuItems = isSingleArtistPage
    ? [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Blogs', href: '/blogs' }
      ]
    : [
        { name: 'About Us', href: '/about' },
        { name: 'Blogs', href: '/blogs' }
      ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={`header ${isSingleArtistPage ? 'single-artist-header' : ''}`}>
      <div className="header-container">
        {/* Contact Info or Logo */}
        {isSingleArtistPage ? (
          <div className="header-logo">
            <a href="/" className="logo-link">
              <img src="/images/logo.png" alt="Granville Tattoo" className="header-logo-img" />
            </a>
          </div>
        ) : (
          <div className="contact-info">
            <a href="tel:6046859800" className="phone-link">
              <svg className="phone-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </a>
            <div className="divider"></div>
            <div className="address">1007 Granville St Vancouver</div>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.name}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <HamburgerMenu 
          menuItems={menuItems} 
          onCloseMenu={() => setIsMenuOpen(false)} 
        />
      )}
    </header>
  );
}