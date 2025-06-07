'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleCloseMenu = () => setIsMobileMenuOpen(false);

  const handlePINAccess = (role: 'first' | 'second') => {
    const correctPIN = role === 'first' ? '1111' : '2222'; // Set your actual PINs here
    const input = prompt(`${role === 'first' ? 'УУГАНБАЯР' : 'ТӨМӨР-ОЧИР'} НУУЦ ҮГЭЭ оруулна уу:`);
    if (input === correctPIN) {
      router.push(`/${role}`);
    } else if (input !== null) {
      alert('Буруу PIN. Дахин оролдоно уу.');
    }
  };

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
          <li><button onClick={() => handlePINAccess('first')}>УУГАНБАЯР</button></li>
          <li><button onClick={() => handlePINAccess('second')}>ТӨМӨР-ОЧИР</button></li>
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
            <li><button onClick={() => { handlePINAccess('first'); handleCloseMenu(); }}>УУГАНБАЯР</button></li>
            <li><button onClick={() => { handlePINAccess('second'); handleCloseMenu(); }}>ТӨМӨР-ОЧИР</button></li>
            <li><a href="/admin" onClick={handleCloseMenu}>АДМИН</a></li>
          </ul>
        </div>
      )}
    </header>
  );
}
