'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleCloseMenu = () => setIsMobileMenuOpen(false);

  const handlePINAccess = (role: 'first' | 'second') => {
    const correctPIN = role === 'first' ? '1111' : '2222';
    const input = prompt(`${role === 'first' ? 'УУГАНБАЯР' : 'ТӨМӨР-ОЧИР'} НУУЦ ҮГЭЭ оруулна уу:`);
    if (input === correctPIN) {
      router.push(`/${role}`);
    } else if (input !== null) {
      alert('Буруу PIN. Дахин оролдоно уу.');
    }
  };

  return (
    <header className="bg-base-100 shadow-sm px-6 py-3 z-50 relative">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={40}
            className="w-auto h-auto max-w-[120px]"
          />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-6 font-semibold text-lg">
          <button onClick={() => handlePINAccess('first')}>УУГАНБАЯР</button>
          <button onClick={() => handlePINAccess('second')}>ТӨМӨР-ОЧИР</button>
          <a href="/admin" className="btn btn-primary text-white">АДМИН</a>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden text-3xl focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-60 mt-3' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col gap-4 font-semibold text-lg bg-base-100 py-4 px-2 rounded shadow-md">
          <li>
            <button onClick={() => { handlePINAccess('first'); handleCloseMenu(); }}>
              УУГАНБАЯР
            </button>
          </li>
          <li>
            <button onClick={() => { handlePINAccess('second'); handleCloseMenu(); }}>
              ТӨМӨР-ОЧИР
            </button>
          </li>
          <li>
            <a href="/admin" onClick={handleCloseMenu} className="text-blue-600">
              АДМИН
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
