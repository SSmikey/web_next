"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "./ProfileLayout.module.css";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => pathname === href;

  return (
    <div className={styles.profileLayout}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>เมนูโปรไฟล์</h2>
          </div>
          
          <nav className={styles.sidebarNav}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link
                  href="/profile"
                  className={`${styles.navLink} ${isActive("/profile") ? styles.active : ''}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  โปรไฟล์
                </Link>
              </li>
              
              <li className={styles.navItem}>
                <Link
                  href="/profile/purchase-history"
                  className={`${styles.navLink} ${isActive("/profile/purchase-history") ? styles.active : ''}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11H3v10h6V11z"></path>
                    <path d="M15 3H9v18h6V3z"></path>
                    <path d="M21 7h-6v14h6V7z"></path>
                  </svg>
                  ประวัติการซื้อ
                </Link>
              </li>

              {session?.user?.role === "admin" && (
                <li className={styles.navItem}>
                  <Link
                    href="/profile/dashboard"
                    className={`${styles.navLink} ${isActive("/profile/dashboard") ? styles.active : ''}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
              </div>
              <div className={styles.userDetails}>
                <div className={styles.userName}>
                  {session?.user?.name || "ผู้ใช้"}
                </div>
                <div className={styles.userRole}>
                  {session?.user?.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้ทั่วไป"}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}