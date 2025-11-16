"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

const images = [
  "/images/V1.png",
  "/images/V2.png",
  "/images/V3.png",
  "/images/V4.png",
  "/images/V5.png",
  "/images/Premium.png"
];

export default function AboutOrderForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto slideshow every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const form = formRef.current;
    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // If valid, navigate to contact page (เลือกแบบและขนาดเสื้อ)
    router.push("/contact");
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.splitLayout}>
        {/* Left Section - Image Slideshow */}
        <div className={styles.imageSection}>
          {/* Navigation Arrow Left - Outside */}
          <button 
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className={styles.imageWrapper}>
            <div className={styles.slideshowContainer}>
              <Image
                src={images[currentImageIndex]}
                alt={`Product ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>

            {/* Dots Indicator */}
            <div className={styles.dotsContainer}>
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentImageIndex ? styles.dotActive : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Arrow Right - Outside */}
          <button 
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={goToNext}
            aria-label="Next image"
          >
            ›
          </button>
        </div>

        {/* Right Section - Form */}
        <div className={styles.formSection}>
          <div className={styles.card}>
            {/* Header Section */}
            <h1 className={styles.title}>ข้อมูลผู้สั่งซื้อ</h1>
            <p className={styles.lead}>กรุณากรอกข้อมูลผู้สั่งซื้อให้ครบถ้วน</p>

            {/* Form Section */}
            <form
              ref={formRef}
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Personal Information */}
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="firstName">
                    ชื่อจริง <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    className={styles.input}
                    type="text"
                    placeholder="ชื่อจริง"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="lastName">
                    นามสกุล <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    className={styles.input}
                    type="text"
                    placeholder="นามสกุล"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="phone">
                    เบอร์โทร <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className={styles.input}
                    type="tel"
                    placeholder="08X-XXX-XXXX"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="email">
                    อีเมล <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    className={styles.input}
                    type="email"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="address">
                  ที่อยู่สำหรับการจัดส่ง <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  className={styles.textarea}
                  placeholder="ที่อยู่ รหัสไปรษณีย์"
                  rows={4}
                  required
                />
              </div>

              {/* Additional Notes */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="note">
                  หมายเหตุ (ถ้ามี)
                </label>
                <textarea
                  id="note"
                  name="note"
                  className={styles.textarea}
                  placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                  rows={3}
                />
              </div>

              {/* Shipping Method */}
              <fieldset className={styles.fieldset}>
                <legend className={styles.label}>
                  การจัดส่งสินค้า <span className={styles.required}>*</span>
                </legend>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="mail"
                      required
                    />
                    <span>ต้องการให้จัดส่งสินค้าทางไปรษณีย์</span>
                  </label>

                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="pickup"
                      required
                    />
                    <span>ต้องการมารับเสื้อด้วยตนเอง</span>
                  </label>
                </div>
              </fieldset>

              {/* Action Buttons */}
              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  aria-label="ถัดไป"
                >
                  ถัดไป : เลือกแบบและขนาดเสื้อ
                </button>

                <Link href="/">
                  <button type="button" className={styles.secondaryButton}>
                    กลับสู่หน้าหลัก
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}