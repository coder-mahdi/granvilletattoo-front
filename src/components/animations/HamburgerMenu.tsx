'use client';

import { useState, useEffect } from 'react';

interface HamburgerMenuProps {
  menuItems: Array<{ name: string; href: string }>;
  onCloseMenu: () => void;
}

export default function HamburgerMenu({ menuItems, onCloseMenu }: HamburgerMenuProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Start showing items one by one after 0.3s delay
    const timer = setTimeout(() => {
      menuItems.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
        }, index * 150); // 150ms delay between each item
      });
    }, 300); // 0.3s initial delay

    return () => clearTimeout(timer);
  }, [menuItems.length]);


  const handleClose = () => {
    setIsClosing(true);
    
    // First: hide menu items (they exit from left)
    setTimeout(() => {
      setVisibleItems([]);
    }, 50);
    
    // Second: after items animation, start background exit animation
    setTimeout(() => {
      // Background image will exit from right via CSS
    }, 400); // Wait for items to finish exiting
    
    // Finally: close menu after all animations complete
    setTimeout(() => {
      onCloseMenu();
      setIsClosing(false);
    }, 1200); // Total time: items (300ms) + background (800ms)
  };

  return (
    <nav className={`mobile-nav active ${isClosing ? 'closing' : ''}`}>
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
            <a href={item.href} onClick={handleClose}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
