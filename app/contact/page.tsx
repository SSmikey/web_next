'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

const SIZES = ['SSS', 'SS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'] as const;
const PRICE_PER_SHIRT = 219;

type Size = typeof SIZES[number];

// 12 แบบเสื้อ
const SHIRT_DESIGNS = [
  { id: 1, name: 'V1', image: '/spvv1.jpg', description: '01 แบบสี', color: '#ffffffff' },
  { id: 2, name: 'V2', image: '/spvv2.jpg', description: '01 แบบสี', color: '#ffffffff' },
  { id: 3, name: 'V3', image: '/spvv3.jpg', description: '01 แบบสี', color: '#ffffffff' },
  { id: 4, name: 'V4', image: '/spvv4.jpg', description: '01 แบบสี', color: '#ffffffff' },
  { id: 5, name: 'V5', image: '/spvv5.jpg', description: '01 แบบสี', color: '#ffffffff' },
  { id: 6, name: 'V1', image: '/spvvb1.jpg', description: '02 แบบไว้ทุกข์', color: '#ffffffff' },
  { id: 7, name: 'V2', image: '/spvvb2.jpg', description: '02 แบบไว้ทุกข์', color: '#ffffffff' },
  { id: 8, name: 'V3', image: '/spvvb3.jpg', description: '02 แบบไว้ทุกข์', color: '#ffffffff' },
  { id: 9, name: 'V4', image: '/spvvb4.jpg', description: '02 แบบไว้ทุกข์', color: '#ffffffff' },
  { id: 10, name: 'V5', image: '/spvvb5.jpg', description: '02 แบบไว้ทุกข์', color: '#ffffffff' },
  { id: 11, name: 'premuim', image: '/spvvm1.png', description: 'รสไก่', color: '#ffffffff' },
  { id: 12, name: 'Premuim', image: '/spvvm2.png', description: 'รสหมู', color: '#ffffffff' },
];

// รูปภาพสำหรับ slideshow
const images = [
  "/images/V1.png",
  "/images/V2.png",
  "/images/V3.png",
  "/images/V4.png",
  "/images/V5.png",
  "/images/Premium.png"
];

export default function ContactPage() {
  const [selectedShirt, setSelectedShirt] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);

  // Slideshow states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);

  const currentShirt = SHIRT_DESIGNS.find(s => s.id === selectedShirt)!;
  const totalPrice = quantity * PRICE_PER_SHIRT;

  // Slideshow functions
  const goToPrevious = () => {
    if (isAnimating) return;
    
    setDirection('left');
    setPreviousImageIndex(currentImageIndex);
    setIsAnimating(true);
    
    const prevIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const goToNext = () => {
    if (isAnimating) return;
    
    setDirection('right');
    setPreviousImageIndex(currentImageIndex);
    setIsAnimating(true);
    
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentImageIndex) return;
    
    setDirection(index > currentImageIndex ? 'right' : 'left');
    setPreviousImageIndex(currentImageIndex);
    setIsAnimating(true);
    
    setCurrentImageIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const getSlideClass = (imageIndex: number) => {
    if (imageIndex === currentImageIndex) {
      return `${styles.slideItem} ${styles.slideActive}`;
    }
    
    if (isAnimating && imageIndex === previousImageIndex) {
      if (direction === 'right') {
        return `${styles.slideItem} ${styles.slideExitLeft}`;
      } else {
        return `${styles.slideItem} ${styles.slideExitRight}`;
      }
    }
    
    if (direction === 'right') {
      return `${styles.slideItem} ${styles.slideHiddenRight}`;
    } else {
      return `${styles.slideItem} ${styles.slideHiddenLeft}`;
    }
  };

  // Form Functions
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleSizeSelect = (size: Size) => {
    setSelectedSize(size);
    setError(false);
  };

  const handleShirtSelect = (id: number) => {
    setSelectedShirt(id);
    setSelectedSize(null);
    setError(false);
  };

  const handleReset = () => {
    // รีเฟรชหน้าเดียว ไม่กระทบหน้าอื่น
    window.location.reload();
  };

  const handleConfirm = () => {
    if (!selectedSize) {
      setError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    alert(
      `✅ ยืนยันการสั่งซื้อสำเร็จ!\n\n` +
      `แบบเสื้อ: ${currentShirt.name}\n` +
      `รายละเอียด: ${currentShirt.description}\n` +
      `ขนาด: ${selectedSize}\n` +
      `จำนวน: ${quantity} ตัว\n` +
      `ยอดรวม: ${totalPrice.toLocaleString()} บาท\n\n` +
      `ขอบคุณที่ร่วมบริจาคเพื่อการกุศล`
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.splitLayout}>
        {/* ========================================
            🖼️ Left Section - Image Slideshow
            ======================================== */}
        <div className={styles.imageSection}>
          {/* Navigation Arrow Left */}
          <button 
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={goToPrevious}
            aria-label="Previous image"
            disabled={isAnimating}
          >
            ‹
          </button>

          <div className={styles.imageWrapper}>
            <div className={styles.slideshowContainer}>
              {images.map((imageSrc, index) => (
                <div key={index} className={getSlideClass(index)}>
                  <Image
                    src={imageSrc}
                    alt={`Product ${index + 1}`}
                    fill
                    style={{ objectFit: "contain", objectPosition: "top" }}
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className={styles.dotsContainer}>
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentImageIndex ? styles.dotActive : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  disabled={isAnimating}
                />
              ))}
            </div>
          </div>

          {/* Navigation Arrow Right */}
          <button 
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={goToNext}
            aria-label="Next image"
            disabled={isAnimating}
          >
            ›
          </button>
        </div>

        {/* ========================================
            📝 Right Section - Form
            ======================================== */}
        <div className={styles.formSection}>
          <div className={styles.formContent}>
            {/* Header */}
            <div className={styles.header}>
              <h1 className={styles.title}>🎽 เลือกแบบเสื้อ ขนาด และจำนวน</h1>
              <p className={styles.subtitle}>SPVV - POLO SHIRT | 12 แบบ 13 ไซส์</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.errorMessage}>
                ⚠️ กรุณาเลือกขนาดเสื้อก่อนยืนยันการสั่งซื้อ
              </div>
            )}

            {/* Shirt Selection Dropdown */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <span>👕</span> เลือกแบบเสื้อ (12 แบบ)
              </div>
              <select
                value={selectedShirt}
                onChange={(e) => handleShirtSelect(Number(e.target.value))}
                className={styles.shirtDropdown}
              >
                {SHIRT_DESIGNS.map((shirt) => (
                  <option key={shirt.id} value={shirt.id}>
                    {shirt.name} - {shirt.description}
                  </option>
                ))}
              </select>

              {/* Selected Shirt Preview */}
              <div className={styles.selectedShirtPreview}>
                <div className={styles.previewTitle}>🎯 แบบเสื้อที่เลือก</div>
                <div 
                  className={styles.previewImageContainer}
                  style={{
                    background: `linear-gradient(135deg, ${currentShirt.color}30 0%, ${currentShirt.color}60 100%)`
                  }}
                >
                  <img 
                    src={currentShirt.image}
                    alt={currentShirt.name}
                    className={styles.previewImage}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div style="font-size: 80px">👕</div>';
                      }
                    }}
                  />
                </div>
                <div className={styles.previewName}>{currentShirt.name}</div>
                <div className={styles.previewDescription}>{currentShirt.description}</div>
                <div className={styles.previewBadge}>
                  {currentShirt.name} - {currentShirt.description}
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <span>📏</span> เลือกขนาดเสื้อ (13 ไซส์)
              </div>
              <div className={styles.sizeGrid}>
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`${styles.sizeButton} ${
                      selectedSize === size ? styles.sizeButtonSelected : ''
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Control */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <span>🔢</span> จำนวนเสื้อ
              </div>
              <div className={styles.quantityControl}>
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className={styles.quantityButton}
                >
                  −
                </button>
                <div className={styles.quantityDisplay}>{quantity}</div>
                <button
                  onClick={increaseQuantity}
                  className={styles.quantityButton}
                >
                  +
                </button>
              </div>
            </div>

            {/* Summary Box */}
            <div className={styles.section}>
              <div className={styles.summaryBox}>
                <div className={styles.summaryTitle}>📋 สรุปรายการสั่งซื้อ</div>
                
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>แบบเสื้อที่เลือก:</span>
                  <span className={styles.summaryValue}>{currentShirt.name} - {currentShirt.description}</span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>ขนาดที่เลือก:</span>
                  <span className={selectedSize ? styles.summaryValue : styles.summaryValueUnselected}>
                    {selectedSize || 'ยังไม่ได้เลือก'}
                  </span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>จำนวน:</span>
                  <span className={styles.summaryValue}>{quantity} ตัว</span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>ราคาต่อตัว:</span>
                  <span className={styles.summaryValue}>219 บาท</span>
                </div>
                
                <div className={styles.summaryTotal}>
                  <span className={styles.summaryTotalLabel}>💰 ยอดรวมทั้งหมด:</span>
                  <span className={styles.summaryTotalValue}>
                    {totalPrice.toLocaleString()} บาท
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button onClick={handleReset} className={styles.resetButton}>
                🔄 ล้างข้อมูล
              </button>
              <button onClick={handleConfirm} className={styles.confirmButton}>
                ✅ ยืนยันการสั่งซื้อ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}