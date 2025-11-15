"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./Navbar.module.css";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.navLogo}>
          ✨ SPVV CLOTHING
        </Link>
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <Link
              href="/"
              className={`${styles.navLink} ${isActive("/") ? styles.active : ""}`}
            >
              Home
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              href="/about"
              className={`${styles.navLink} ${isActive("/about") ? styles.active : ""}`}
            >
              About
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              href="/contact"
              className={`${styles.navLink} ${isActive("/contact") ? styles.active : ""}`}
            >
              Contact
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              href="/survey"
              className={`${styles.navLink} ${isActive("/survey") ? styles.active : ""}`}
            >
              แบบสอบถาม
            </Link>
          </li>
        </ul>
        <div className={styles.authMenu}>
          {status === "loading" ? (
            <div className={styles.loadingSpinner}>Loading...</div>
          ) : session ? (
            <ProfileDropdown />
          ) : (
            <div className={styles.authButtons}>
              <Link
                href="/auth/signin"
                className={`${styles.authButton} ${styles.signInButton}`}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className={`${styles.authButton} ${styles.signUpButton}`}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}