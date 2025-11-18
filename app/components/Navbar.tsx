"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./Navbar.module.css";
import ProfileDropdown from "./ProfileDropdown";
import ThemeToggle from "./ThemeToggle";

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
        </ul>
        <div className={styles.authMenu}>
          <ThemeToggle />
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