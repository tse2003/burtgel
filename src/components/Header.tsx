'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'first' | 'second' | 'admin' | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCloseMenu = () => setIsMobileMenuOpen(false);

  const openPINModal = (role: 'first' | 'second' | 'admin') => {
    setSelectedRole(role);
    setPinInput('');
    setError('');
    setPinModalOpen(true);
  };

  const handleSubmitPIN = () => {
    let correctPIN = '';
    if (selectedRole === 'first') correctPIN = '1111';
    else if (selectedRole === 'second') correctPIN = '2222';
    else if (selectedRole === 'admin') correctPIN = '0516';

    if (pinInput === correctPIN) {
      setPinModalOpen(false);
      router.push(`/${selectedRole === 'admin' ? 'admin' : selectedRole}`);
    } else {
      setError('Буруу PIN. Дахин оролдоно уу.');
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
          <button onClick={() => openPINModal('first')}>УУГАНБАЯР</button>
          <button onClick={() => openPINModal('second')}>ТӨМӨР-ОЧИР</button>
          <button onClick={() => openPINModal('admin')} className="btn btn-primary text-white">
            АДМИН
          </button>
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
            <button onClick={() => { openPINModal('first'); handleCloseMenu(); }}>
              УУГАНБАЯР
            </button>
          </li>
          <li>
            <button onClick={() => { openPINModal('second'); handleCloseMenu(); }}>
              ТӨМӨР-ОЧИР
            </button>
          </li>
          <li>
            <button onClick={() => { openPINModal('admin'); handleCloseMenu(); }} className="text-blue-600">
              АДМИН
            </button>
          </li>
        </ul>
      </div>

      {/* PIN Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">
              {selectedRole === 'first'
                ? 'УУГАНБАЯР'
                : selectedRole === 'second'
                ? 'ТӨМӨР-ОЧИР'
                : 'АДМИН'} - Нууц үг оруулна уу
            </h2>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="input input-bordered w-full mb-2"
              placeholder="****"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-outline" onClick={() => setPinModalOpen(false)}>
                Болих
              </button>
              <button className="btn btn-primary text-white" onClick={handleSubmitPIN}>
                Нэвтрэх
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
