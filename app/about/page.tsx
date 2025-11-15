"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function AboutOrderForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    // Use HTML5 validation first
    if (!form.checkValidity()) {
      // This will trigger browser validation UI
      form.reportValidity();
      return;
    }

    // If valid, navigate to contact page (เลือกแบบและขนาดเสื้อ)
    router.push("/contact");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>ฟอร์มข้อมูลผู้สั่งซื้อ</h1>
        <p className={styles.lead}>กรุณากรอกข้อมูลผู้สั่งซื้อให้ครบถ้วน</p>

        <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="firstName">ชื่อจริง <span className={styles.required}>*</span></label>
              <input id="firstName" name="firstName" className={styles.input} type="text" placeholder="ชื่อจริง" required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="lastName">นามสกุล <span className={styles.required}>*</span></label>
              <input id="lastName" name="lastName" className={styles.input} type="text" placeholder="นามสกุล" required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="phone">เบอร์โทร <span className={styles.required}>*</span></label>
              <input id="phone" name="phone" className={styles.input} type="tel" placeholder="08X-XXX-XXXX" required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">อีเมล <span className={styles.required}>*</span></label>
              <input id="email" name="email" className={styles.input} type="email" placeholder="example@email.com" required />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="address">ที่อยู่สำหรับการจัดส่ง <span className={styles.required}>*</span></label>
            <textarea id="address" name="address" className={styles.textarea} placeholder="ที่อยู่ รหัสไปรษณีย์" rows={4} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="note">หมายเหตุ (ถ้ามี)</label>
            <textarea id="note" name="note" className={styles.textarea} placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)" rows={3} />
          </div>

          <fieldset className={styles.fieldset}>
            <legend className={styles.label}>การจัดส่งสินค้า <span className={styles.required}>*</span></legend>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input type="radio" name="shippingMethod" value="mail" required />
                <span>ต้องการให้จัดส่งสินค้าทางไปรษณีย์</span>
              </label>

              <label className={styles.radioLabel}>
                <input type="radio" name="shippingMethod" value="pickup" required />
                <span>ต้องการมารับเสื้อด้วยตนเอง</span>
              </label>
            </div>
          </fieldset>

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton} aria-label="ถัดไป">ถัดไป : เลือกแบบและขนาดเสื้อ</button>

            <Link href="/">
              <button type="button" className={styles.secondaryButton}>กลับสู่หน้าหลัก</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
