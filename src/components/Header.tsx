'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  const toggleMenu = () => {
    if (isMenuOpen) {
      // Start closing animation
      setIsClosing(true);
      setVisibleItems([]);
      
      // Close menu after animation
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsClosing(false);
      }, 800); // Match animation duration
    } else {
      setIsMenuOpen(true);
      setIsClosing(false);
    }
  };

  const menuItems = [
    { name: 'Book Now', href: '/book' },
    { name: 'About Us', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Artist', href: '/artist' },
    { name: 'Services', href: '/services' },
    { name: 'Blogs', href: '/blogs' }
  ];

  useEffect(() => {
    if (isMenuOpen && !isClosing) {
      // Start showing items one by one after 0.3s delay
      const timer = setTimeout(() => {
        menuItems.forEach((_, index) => {
          setTimeout(() => {
            setVisibleItems(prev => [...prev, index]);
          }, index * 150); // 150ms delay between each item
        });
      }, 300); // 0.3s initial delay

      return () => clearTimeout(timer);
    } else if (isClosing) {
      // Reverse animation for closing
      setVisibleItems([]);
    }
  }, [isMenuOpen, isClosing]);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // tablet breakpoint
        setIsMenuOpen(false);
        setVisibleItems([]);
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
      <nav className={`mobile-nav ${isMenuOpen ? 'active' : ''} ${isClosing ? 'closing' : ''}`}>
        {/* Background Image */}
        <div className="menu-background">
          <img src="/images/pic1.png" alt="Menu Background" />
        </div>
        
        <ul>
          {menuItems.map((item, index) => (
            <li 
              key={index}
              className={`menu-item ${visibleItems.includes(index) ? 'visible' : 'hidden'}`}
            >
              <a href={item.href} onClick={() => toggleMenu()}>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}