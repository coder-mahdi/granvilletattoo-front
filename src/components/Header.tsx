'use client';

import { useState, useEffect } from 'react';
import HamburgerMenu from './animations/HamburgerMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Book Now', href: '/book' },
    { name: 'About Us', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Artist', href: '/artist' },
    { name: 'Services', href: '/services' },
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
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <img src="/logo.svg" alt="Granville Tattoo" className="logo-img" />
        </div>

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