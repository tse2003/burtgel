'use client';
import { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFacebook } from '@fortawesome/free-brands-svg-icons';
// import { faBars } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="navbar bg-base-100 shadow-sm px-6 py-2">
      {/* Logo */}
      <div className="navbar-start flex items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={120}
          className="mr-2"
        />
        {/* Mobile menu button */}
        <button
          className="lg:hidden ml-4 text-xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Center menu for desktop */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-semibold text-lg">
          <li><a href='/first'>1-Р АЖИЛТАН</a></li>
          <li><a href='/second'>2-Р АЖИЛТАН</a></li>
          {/* <li><a href='/tsorgo'>Цорготой ус цэвэршүүлэгч</a></li>
          <li><a href='/filter'>Филтер</a></li>
          <li><a href='/bide'>DS-800 Бидэ</a></li> */}
        </ul>
      </div>

      {/* Contact dropdown */}
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <button className="btn btn-primary text-white"><a href='admin'>АДМИН</a></button>
        </div>
      </div>

      {/* Mobile menu */}
      {/* {isMobileMenuOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-base-100 shadow-md p-4 z-50 lg:hidden">
          <ul className="flex flex-col gap-3 text-lg font-semibold">
            <li><a onClick={() => setIsMobileMenuOpen(false)}>Захиалга өгөх</a></li>
            <li><a onClick={() => setIsMobileMenuOpen(false)}>WINIX TS-200s</a></li>
            <li><a onClick={() => setIsMobileMenuOpen(false)}>Цорготой ус цэвэршүүлэгч</a></li>
          </ul>
        </div>
      )} */}
    </div>
  );
}
