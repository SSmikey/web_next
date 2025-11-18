'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const SIZES = ['SSS', 'SS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'] as const;

type Size = typeof SIZES[number];

// 12 แบบเสื้อ (แยกราคา V-series = 219, Premium = 259)
const SHIRT_DESIGNS = [
  { id: 1, name: 'V1', image: '/spvv1.jpg', description: '01 แบบสี', color: '#ffffffff', price: 219 },
  { id: 2, name: 'V2', image: '/spvv2.jpg', description: '01 แบบสี', color: '#ffffffff', price: 219 },
  { id: 3, name: 'V3', image: '/spvv3.jpg', description: '01 แบบสี', color: '#ffffffff', price: 219 },
  { id: 4, name: 'V4', image: '/spvv4.jpg', description: '01 แบบสี', color: '#ffffffff', price: 219 },
  { id: 5, name: 'V5', image: '/spvv5.jpg', description: '01 แบบสี', color: '#ffffffff', price: 219 },
  { id: 6, name: 'V1', image: '/spvvb1.jpg', description: '02 แบบไว้ทุกข์', color: '#ffffffff', price: 219 },
  { id: 7, name: 'V2', image: '/spvvb2.jpg', description: '02 แบบไว้ทุกข์', color: '#ffffffff', price: 219 },
  { id: 8, name: 'V3', image: '/spvvb3.jpg', description: '02 แบบไว้ทุกข์', color: '#ffffffff', price: 219 },
  { id: 9, name: 'V4', image: '/spvvb4.jpg', description: '02 แบบไว้ทุกข์', color: '#ffffffff', price: 219 },
  { id: 10, name: 'V5', image: '/spvvb5.jpg', description: '02 แบบไว้ทุกข์', color: '#ffffffff', price: 219 },
  { id: 11, name: 'premuim', image: '/spvvm1.png', description: 'รสไก่', color: '#ffffffff', price: 259 },
  { id: 12, name: 'Premuim', image: '/spvvm2.png', description: 'รสหมู', color: '#ffffffff', price: 259 },
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

export default function SelectProductsPage() {
  const router = useRouter();
  const [selectedShirt, setSelectedShirt] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string | boolean>(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    note: '',
    shippingMethod: 'mail' // Default to mail shipping
  });

  // Load customer info from sessionStorage on component mount
  useEffect(() => {
    const savedCustomerInfo = sessionStorage.getItem('customerInfo');
    if (savedCustomerInfo) {
      try {
        const parsedInfo = JSON.parse(savedCustomerInfo);
        setCustomerInfo(parsedInfo);
      } catch (error) {
        console.error('Error parsing customer info from sessionStorage:', error);
      }
    }
  }, []);

  // Slideshow states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);

  const currentShirt = SHIRT_DESIGNS.find(s => s.id === selectedShirt) || SHIRT_DESIGNS[0];
  
  // คำนวณค่าส่ง: 1 ตัว = 50 บาท, ตัวที่ 2+ = +10 บาท/ตัว
  // ถ้าเลือกมารับเอง จะไม่มีค่าส่ง
  const shippingCost = customerInfo.shippingMethod === 'pickup' ? 0 : (quantity === 0 ? 0 : quantity === 1 ? 50 : 50 + (quantity - 1) * 10);
  
  // คำนวณราคาเสื้อทั้งหมด
  const subtotal = quantity * currentShirt.price;
  
  // ยอดรวมทั้งหมด
  const totalPrice = subtotal + shippingCost;

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
  const decreaseQuantity = () => setQuantity(prev => Math.max(0, prev - 1));

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
    setSelectedShirt(0);
    setSelectedSize(null);
    setQuantity(0);
    setError(false);
  };

  const handleConfirm = async () => {
    if (!selectedSize || selectedShirt === 0 || quantity === 0) {
      setError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validate customer information
    const { firstName, lastName, email, phone, address } = customerInfo;
    if (!firstName || !lastName || !email || !phone || !address) {
      setError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const orderData = {
        customerInfo: {
          firstName,
          lastName,
          email,
          phone,
          address,
          note: customerInfo.note
        },
        items: [{
          productId: currentShirt.id.toString(),
          productName: currentShirt.name,
          productDescription: currentShirt.description,
          price: currentShirt.price,
          quantity,
          size: selectedSize,
          imageUrl: currentShirt.image
        }],
        totalAmount: subtotal,
        shippingCost,
        shippingMethod: customerInfo.shippingMethod
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        // Set order data for popup
        setOrderData({
          orderNumber: data.order.orderNumber,
          shirtName: currentShirt.name,
          shirtDescription: currentShirt.description,
          size: selectedSize,
          quantity: quantity,
          subtotal: subtotal,
          shippingCost: shippingCost,
          totalPrice: totalPrice
        });
        
        // Show confirmation popup
        setShowConfirmation(true);
        
        // Reset form
        handleReset();
        setCustomerInfo({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          note: ''
        });
      } else {
        setError(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
    setError(false);
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

          <div className={styles.slideshowContainer}>
            {images.map((imageSrc, index) => (
              <div key={index} className={getSlideClass(index)}>
                <Image
                  src={imageSrc}
                  alt={`Product ${index + 1}`}
                  fill
                  style={{ objectFit: "contain", objectPosition: "top center" }}
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
                ⚠️ {typeof error === 'string' && error.includes('Missing') ? 'กรุณากรอกข้อมูลให้ครบถ้วน' : 'กรุณาเลือกแบบเสื้อ ขนาด และจำนวนก่อนยืนยันการสั่งซื้อ'}
              </div>
            )}

            {/* Customer Information Form */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <span>👤</span> ข้อมูลผู้สั่งซื้อ
              </div>
              
              <div className={styles.customerInfoGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>ชื่อ <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="ชื่อจริง"
                    value={customerInfo.firstName}
                    onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>นามสกุล <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="นามสกุล"
                    value={customerInfo.lastName}
                    onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>เบอร์โทร <span className={styles.required}>*</span></label>
                  <input
                    type="tel"
                    className={styles.input}
                    placeholder="08X-XXX-XXXX"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>อีเมล <span className={styles.required}>*</span></label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="example@email.com"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div className={styles.formGroupFull}>
                  <label className={styles.inputLabel}>ที่อยู่จัดส่ง <span className={styles.required}>*</span></label>
                  <textarea
                    className={styles.textarea}
                    placeholder="ที่อยู่ รหัสไปรษณีย์"
                    rows={3}
                    value={customerInfo.address}
                    onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                    required
                  />
                </div>
                
                <div className={styles.formGroupFull}>
                  <label className={styles.inputLabel}>หมายเหตุ (ถ้ามี)</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="หมายเหตุเพิ่มเติม"
                    rows={2}
                    value={customerInfo.note}
                    onChange={(e) => handleCustomerInfoChange('note', e.target.value)}
                  />
                </div>
              </div>
            </div>

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
                <option value={0} disabled>-- เลือกแบบเสื้อ --</option>
                {SHIRT_DESIGNS.map((shirt) => (
                  <option key={shirt.id} value={shirt.id}>
                    {shirt.name} - {shirt.description}
                  </option>
                ))}
              </select>

              {/* Selected Shirt Preview */}
              {selectedShirt !== 0 && (
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
              )}
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
                  disabled={quantity <= 0}
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
                  <span className={selectedShirt !== 0 ? styles.summaryValue : styles.summaryValueUnselected}>
                    {selectedShirt !== 0 ? `${currentShirt.name} - ${currentShirt.description}` : 'ยังไม่ได้เลือก'}
                  </span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>ขนาดที่เลือก:</span>
                  <span className={selectedSize ? styles.summaryValue : styles.summaryValueUnselected}>
                    {selectedSize || 'ยังไม่ได้เลือก'}
                  </span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>จำนวน:</span>
                  <span className={quantity > 0 ? styles.summaryValue : styles.summaryValueUnselected}>
                    {quantity > 0 ? `${quantity} ตัว` : 'ยังไม่ได้เลือก'}
                  </span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>ราคาต่อตัว:</span>
                  <span className={selectedShirt !== 0 ? styles.summaryValue : styles.summaryValueUnselected}>
                    {selectedShirt !== 0 ? `${currentShirt.price} บาท` : '-'}
                  </span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>ราคาเสื้อทั้งหมด:</span>
                  <span className={styles.summaryValue}>{subtotal.toLocaleString()} บาท</span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>ค่าจัดส่ง:</span>
                  <span className={styles.summaryValue}>{shippingCost} บาท</span>
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
              <button onClick={handleConfirm} disabled={loading} className={styles.confirmButton}>
                {loading ? '⏳ กำลังดำเนินการ...' : '✅ ยืนยันการสั่งซื้อ'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Popup */}
      {showConfirmation && orderData && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContainer}>
            <div className={styles.popupHeader}>
              <button
                className={styles.popupCloseButton}
                onClick={() => setShowConfirmation(false)}
              >
                ×
              </button>
              <div className={styles.popupSuccessIcon}>
                ✓
              </div>
              <h2 className={styles.popupTitle}>ยืนยันการสั่งซื้อสำเร็จ!</h2>
              <p className={styles.popupSubtitle}>ขอบคุณสำหรับการสั่งซื้อสินค้า</p>
            </div>
            
            <div className={styles.popupBody}>
              <div className={styles.popupOrderNumber}>
                <div className={styles.popupOrderNumberLabel}>เลขที่ออเดอร์</div>
                <div className={styles.popupOrderNumberValue}>{orderData.orderNumber}</div>
              </div>
              
              <div className={styles.popupCustomerInfo}>
                <div className={styles.popupCustomerNameLabel}>ชื่อผู้สั่งซื้อ</div>
                <div className={styles.popupCustomerNameValue}>{orderData.customerName}</div>
              </div>
              
              <div className={styles.popupOrderDetails}>
                <h3 className={styles.popupDetailTitle}>
                  <span>📋</span> รายละเอียดการสั่งซื้อ
                </h3>
                
                <div className={styles.popupDetailItem}>
                  <span className={styles.popupDetailLabel}>แบบเสื้อ:</span>
                  <span className={styles.popupDetailValue}>{orderData.shirtName} - {orderData.shirtDescription}</span>
                </div>
                
                <div className={styles.popupDetailItem}>
                  <span className={styles.popupDetailLabel}>ขนาด:</span>
                  <span className={styles.popupDetailValue}>{orderData.size}</span>
                </div>
                
                <div className={styles.popupDetailItem}>
                  <span className={styles.popupDetailLabel}>จำนวน:</span>
                  <span className={styles.popupDetailValue}>{orderData.quantity} ตัว</span>
                </div>
                
                <div className={styles.popupDetailItem}>
                  <span className={styles.popupDetailLabel}>ราคาเสื้อ:</span>
                  <span className={styles.popupDetailValue}>{orderData.subtotal.toLocaleString()} บาท</span>
                </div>
                
                <div className={styles.popupDetailItem}>
                  <span className={styles.popupDetailLabel}>ค่าจัดส่ง:</span>
                  <span className={styles.popupDetailValue}>{orderData.shippingCost.toLocaleString()} บาท</span>
                </div>
              </div>
              
              <div className={styles.popupTotal}>
                <span className={styles.popupTotalLabel}>ยอดรวมทั้งหมด:</span>
                <span className={styles.popupTotalValue}>{orderData.totalPrice.toLocaleString()} บาท</span>
              </div>
            </div>
            
            <div className={styles.popupFooter}>
              <button
                className={`${styles.popupButton} ${styles.popupButtonSecondary}`}
                onClick={() => setShowConfirmation(false)}
              >
                ปิด
              </button>
              <button
                className={`${styles.popupButton} ${styles.popupButtonPrimary}`}
                onClick={() => {
                  setShowConfirmation(false);
                  // Optional: Navigate to another page or perform another action
                }}
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
