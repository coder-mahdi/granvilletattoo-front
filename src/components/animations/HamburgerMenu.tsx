'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HamburgerMenuProps {
  menuItems: Array<{ name: string; href: string }>;
  onCloseMenu: () => void;
}

export default function HamburgerMenu({ menuItems, onCloseMenu }: HamburgerMenuProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    const timeouts: Array<ReturnType<typeof setTimeout>> = [];

    const startTimer = setTimeout(() => {
      menuItems.forEach((_, index) => {
        const itemTimer = setTimeout(() => {
          setVisibleItems(prev => (prev.includes(index) ? prev : [...prev, index]));
        }, index * 150);

        timeouts.push(itemTimer);
      });
    }, 300);

    return () => {
      clearTimeout(startTimer);
      timeouts.forEach(clearTimeout);
      setVisibleItems([]);
    };
  }, [menuItems]);

  useEffect(() => {
    return () => {
      closeTimeoutsRef.current.forEach(clearTimeout);
      closeTimeoutsRef.current = [];
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);

    closeTimeoutsRef.current.forEach(clearTimeout);
    closeTimeoutsRef.current = [];

    const closeTimeout = setTimeout(() => {
      setVisibleItems([]);
    }, 50);

    const backgroundTimeout = setTimeout(() => {
      // Background image will exit from right via CSS
    }, 400);

    const finalTimeout = setTimeout(() => {
      onCloseMenu();
      setIsClosing(false);
    }, 1200);

    closeTimeoutsRef.current.push(closeTimeout, backgroundTimeout, finalTimeout);
  };

  return (
    <nav className={`mobile-nav active ${isClosing ? 'closing' : ''}`}>
      {/* Background Image */}
      <div className="menu-background">
        <Image
          src="/images/pic1.png"
          alt="Menu Background"
          width={720}
          height={1280}
          className="menu-background-img"
          priority
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      
      <ul>
        {menuItems.map((item, index) => (
          <li 
            key={index}
            className={`menu-item ${visibleItems.includes(index) ? 'visible' : 'hidden'}`}
          >
            <Link href={item.href} onClick={handleClose}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
