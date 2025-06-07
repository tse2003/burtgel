'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCloseMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="navbar bg-base-100 shadow-sm px-6 py-2 relative z-50">
      {/* Logo and mobile toggle */}
      <div className="navbar-start flex items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={120}
          className="mr-2 w-auto h-auto max-w-[120px]"
        />
        <button
          className="lg:hidden ml-4 text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-semibold text-lg">
          <li><a href="/first">1-Р АЖИЛТАН</a></li>
          <li><a href="/second">2-Р АЖИЛТАН</a></li>
        </ul>
      </div>

      {/* Admin button */}
      <div className="navbar-end">
        <a href="/admin" className="btn btn-primary text-white">АДМИН</a>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-base-100 shadow-md p-4 transition-all duration-300 lg:hidden">
          <ul className="flex flex-col gap-3 text-lg font-semibold">
            <li><a href="/first" onClick={handleCloseMenu}>1-Р АЖИЛТАН</a></li>
            <li><a href="/second" onClick={handleCloseMenu}>2-Р АЖИЛТАН</a></li>
            <li><a href="/admin" onClick={handleCloseMenu}>АДМИН</a></li>
          </ul>
        </div>
      )}
    </header>
  );
}
