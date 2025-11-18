"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import styles from "./ProfileDropdown.module.css";

export default function ProfileDropdown() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href;

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!session) return null;

  return (
    <div className={styles.profileDropdown} ref={dropdownRef}>
      <button 
        className={styles.profileButton}
        onClick={toggleDropdown}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className={styles.avatar}>
          {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
        </div>
        <span className={styles.userName}>
          {session.user?.name || session.user?.email}
        </span>
        <svg 
          className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.open : ''}`}
          width="12" 
          height="8" 
          viewBox="0 0 12 8" 
          fill="none"
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownHeader}>
            <div className={styles.headerAvatar}>
              {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.headerName}>
                {session.user?.name || "User"}
              </div>
              <div className={styles.headerEmail}>
                {session.user?.email}
              </div>
            </div>
          </div>

          <div className={styles.dropdownDivider}></div>

          <div className={styles.menuItems}>
            <Link
              href="/profile"
              className={`${styles.menuItem} ${isActive("/profile") ? styles.active : ''}`}
              onClick={() => setIsDropdownOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              โปรไฟล์
            </Link>

            <Link
              href="/profile/purchase-history"
              className={`${styles.menuItem} ${isActive("/profile/purchase-history") ? styles.active : ''}`}
              onClick={() => setIsDropdownOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11H3v10h6V11z"></path>
                <path d="M15 3H9v18h6V3z"></path>
                <path d="M21 7h-6v14h6V7z"></path>
              </svg>
              ประวัติการซื้อ
            </Link>

            {session.user?.role === "admin" && (
              <Link
                href="/profile/dashboard"
                className={`${styles.menuItem} ${isActive("/profile/dashboard") ? styles.active : ''}`}
                onClick={() => setIsDropdownOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Dashboard
              </Link>
            )}
          </div>

          <div className={styles.dropdownDivider}></div>

          <button
            onClick={handleSignOut}
            className={styles.signOutButton}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
              ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  );
}