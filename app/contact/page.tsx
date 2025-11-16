'use client';

import { useState } from 'react';

const SIZES = ['SSS', 'SS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'] as const;
const PRICE_PER_SHIRT = 219;

type Size = typeof SIZES[number];

// 12 แบบเสื้อ พร้อมรูปภาพ
const SHIRT_DESIGNS = [
  { id: 1, name: 'เสื้อรุ่นคลาสสิค', public: '/images/spvv1.jpg', description: 'เสื้อคอปก สีดำเหลือง', color: '#667eea' },
  { id: 2, name: 'เสื้อรุ่นพรีเมียม', image: '/images/spvv2.jpg', description: 'เสื้อคอปก สีน้ำเงินเหลือง', color: '#764ba2' },
  { id: 3, name: 'เสื้อรุ่นสปอร์ต', image: '/images/spvv3.jpg', description: 'เสื้อกีฬา ระบายอากาศดี', color: '#f093fb' },
  { id: 4, name: 'เสื้อรุ่นเบสิค', image: '/images/spvv4.jpg', description: 'เสื้อคอปก สีพื้น', color: '#4facfe' },
  { id: 5, name: 'เสื้อรุ่นลายการ์ตูน', image: '/images/spvv5.jpg', description: 'เสื้อคอปก สีพื้น', color: '#43e97b' },
  { id: 6, name: 'เสื้อรุ่นวินเทจ', image: '/images/spvvb1.jpg', description: 'เสื้อสไตล์ย้อนยุค', color: '#fa709a' },
  { id: 7, name: 'เสื้อรุ่นโมเดิร์น', image: '/images/spvvb2.jpg', description: 'เสื้อดีไซน์ทันสมัย', color: '#30cfd0' },
  { id: 8, name: 'เสื้อรุ่นเอเชีย', image: '/images/spvvb3.jpg', description: 'เสื้อกีฬา สีพื้น', color: '#a8edea' },
  { id: 9, name: 'เสื้อรุ่นยูนิเซ็กซ์', image: '/images/spvvb4.jpg', description: 'เสื้อใส่ได้ทุกเพศ', color: '#fbc2eb' },
  { id: 10, name: 'เสื้อรุ่นลำลอง', image: '/images/spvvb5.jpg', description: 'เสื้อสบายๆ ใส่เที่ยว', color: '#a1c4fd' },
  { id: 11, name: 'เสื้อรุ่นออฟฟิศ', image: '/images/spvv1.jpg', description: 'เสื้อเข้าออฟฟิศได้', color: '#d299c2' },
  { id: 12, name: 'เสื้อรุ่นพิเศษ', image: '/images/spvv1.jpg', description: 'เสื้อรุ่นลิมิเต็ด', color: '#ffecd2' },
];


export default function ContactPage() {
  const [selectedShirt, setSelectedShirt] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);

  const currentShirt = SHIRT_DESIGNS.find(s => s.id === selectedShirt)!;
  const totalPrice = quantity * PRICE_PER_SHIRT;

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
    setSelectedShirt(1);
    setSelectedSize(null);
    setQuantity(1);
    setError(false);
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '40px 30px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            🎽 เลือกแบบเสื้อ ขนาด และจำนวน
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.95 }}>
            SPVV-SHIRT | 12 แบบ 15 ไซส์
          </p>
        </div>

        <div style={{ padding: '40px 30px' }}>
          {/* Error Message */}
          {error && (
            <div style={{
              background: '#ffe6e6',
              color: '#d32f2f',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px',
              borderLeft: '4px solid #d32f2f',
              animation: 'shake 0.5s'
            }}>
              ⚠️ กรุณาเลือกขนาดเสื้อก่อนยืนยันการสั่งซื้อ
            </div>
          )}

          {/* Shirt Selection */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              fontSize: '22px',
              fontWeight: 600,
              color: '#333',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>👕</span> เลือกแบบเสื้อ (12 แบบ)
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '15px',
              maxHeight: '500px',
              overflowY: 'auto',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '15px',
              border: '2px solid #e0e0e0'
            }}>
              {SHIRT_DESIGNS.map((shirt) => (
                <div
                  key={shirt.id}
                  onClick={() => handleShirtSelect(shirt.id)}
                  style={{
                    padding: '15px',
                    border: selectedShirt === shirt.id ? '3px solid #667eea' : '2px solid #e0e0e0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: selectedShirt === shirt.id 
                      ? 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' 
                      : 'white',
                    transition: 'all 0.3s ease',
                    transform: selectedShirt === shirt.id ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: selectedShirt === shirt.id 
                      ? '0 8px 20px rgba(102, 126, 234, 0.3)' 
                      : '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    background: `linear-gradient(135deg, ${shirt.color}50 0%, ${shirt.color}80 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img 
                      src={shirt.image}
                      alt={shirt.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div style="font-size: 60px">👕</div>';
                        }
                      }}
                    />
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: '5px',
                    textAlign: 'center'
                  }}>
                    {shirt.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    textAlign: 'center',
                    lineHeight: '1.3'
                  }}>
                    {shirt.description}
                  </div>
                  {selectedShirt === shirt.id && (
                    <div style={{
                      marginTop: '8px',
                      textAlign: 'center',
                      color: '#667eea',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      ✓ เลือกแล้ว
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Shirt Preview */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '40px',
            padding: '30px',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '20px',
            border: '3px solid #667eea'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#667eea',
              marginBottom: '20px'
            }}>
              🎯 แบบเสื้อที่เลือก
            </div>
            <div style={{
              width: '100%',
              maxWidth: '280px',
              height: '280px',
              background: `linear-gradient(135deg, ${currentShirt.color}30 0%, ${currentShirt.color}60 100%)`,
              borderRadius: '20px',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
              overflow: 'hidden',
              border: '3px solid white'
            }}>
              <img 
                src={currentShirt.image}
                alt={currentShirt.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div style="font-size: 120px">👕</div>';
                  }
                }}
              />
            </div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: 600,
              color: '#667eea',
              marginBottom: '8px'
            }}>
              {currentShirt.name}
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#666',
              marginBottom: '15px'
            }}>
              {currentShirt.description}
            </p>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'white',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#667eea',
              border: '2px solid #667eea'
            }}>
              รหัส: #{currentShirt.id.toString().padStart(2, '0')}
            </div>
          </div>

          {/* Size Selection */}
          <div style={{ marginBottom: '35px' }}>
            <div style={{
              fontSize: '22px',
              fontWeight: 600,
              color: '#333',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>📏</span> เลือกขนาดเสื้อ (15 ไซส์)
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))',
              gap: '12px'
            }}>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  style={{
                    padding: '18px 10px',
                    textAlign: 'center',
                    border: selectedSize === size ? '3px solid #667eea' : '3px solid #e0e0e0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: selectedSize === size 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'white',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: selectedSize === size ? 'white' : '#555',
                    transition: 'all 0.3s ease',
                    transform: selectedSize === size ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: selectedSize === size 
                      ? '0 8px 20px rgba(102, 126, 234, 0.4)' 
                      : 'none'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Control */}
          <div style={{ marginBottom: '35px' }}>
            <div style={{
              fontSize: '22px',
              fontWeight: 600,
              color: '#333',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>🔢</span> จำนวนเสื้อ
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '25px',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              padding: '30px',
              borderRadius: '15px',
              border: '2px solid #e0e0e0'
            }}>
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                style={{
                  width: '55px',
                  height: '55px',
                  border: 'none',
                  background: quantity <= 1 
                    ? '#cccccc' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '28px',
                  cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                −
              </button>
              <div style={{
                fontSize: '42px',
                fontWeight: 700,
                color: '#333',
                minWidth: '100px',
                textAlign: 'center',
                padding: '10px 20px',
                background: 'white',
                borderRadius: '12px',
                border: '2px solid #667eea'
              }}>
                {quantity}
              </div>
              <button
                onClick={increaseQuantity}
                style={{
                  width: '55px',
                  height: '55px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '28px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Summary Box */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
            padding: '30px',
            borderRadius: '15px',
            marginBottom: '25px',
            border: '3px solid #667eea',
            boxShadow: '0 5px 15px rgba(102, 126, 234, 0.2)'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#667eea',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              📋 สรุปรายการสั่งซื้อ
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              fontSize: '16px',
              padding: '12px',
              background: 'white',
              borderRadius: '8px'
            }}>
              <span style={{ color: '#666', fontWeight: 500 }}>แบบเสื้อที่เลือก:</span>
              <span style={{ color: '#333', fontWeight: 700 }}>
                {currentShirt.name}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              fontSize: '16px',
              padding: '12px',
              background: 'white',
              borderRadius: '8px'
            }}>
              <span style={{ color: '#666', fontWeight: 500 }}>ขนาดที่เลือก:</span>
              <span style={{ 
                color: selectedSize ? '#333' : '#999', 
                fontWeight: 700 
              }}>
                {selectedSize || 'ยังไม่ได้เลือก'}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              fontSize: '16px',
              padding: '12px',
              background: 'white',
              borderRadius: '8px'
            }}>
              <span style={{ color: '#666', fontWeight: 500 }}>จำนวน:</span>
              <span style={{ color: '#333', fontWeight: 700 }}>{quantity} ตัว</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              fontSize: '16px',
              padding: '12px',
              background: 'white',
              borderRadius: '8px'
            }}>
              <span style={{ color: '#666', fontWeight: 500 }}>ราคาต่อตัว:</span>
              <span style={{ color: '#333', fontWeight: 700 }}>219 บาท</span>
            </div>
            <div style={{
              borderTop: '3px solid #667eea',
              paddingTop: '20px',
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '20px',
              padding: '15px',
              background: 'white',
              borderRadius: '8px'
            }}>
              <span style={{ color: '#333', fontWeight: 700 }}>
                💰 ยอดรวมทั้งหมด:
              </span>
              <span style={{ 
                color: '#667eea', 
                fontWeight: 700, 
                fontSize: '28px',
                textShadow: '1px 1px 2px rgba(102, 126, 234, 0.3)'
              }}>
                {totalPrice.toLocaleString()} บาท
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button
              onClick={handleReset}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '20px',
                background: 'white',
                color: '#667eea',
                border: '3px solid #667eea',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🔄 ล้างข้อมูล
            </button>
            <button
              onClick={handleConfirm}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              ✅ ยืนยันการสั่งซื้อ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}