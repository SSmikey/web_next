"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.navLogo}>
          ✨ MyWebsite
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
      </div>
    </nav>
  );
}