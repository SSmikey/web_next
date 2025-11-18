# SPVV CLOTHING

เว็บไซต์จำหน่ายเสื้อโปโลออนไลน์คุณภาพพรีเมี่ยม เหมาะสำหรับทุกโอกาส

## 📋 ข้อมูลเว็บไซต์

- **ชื่อ**: SPVV CLOTHING
- **ประเภท**: E-commerce (ขายเสื้อโปโล)
- **ฟรีมเวิร์ก**: Next.js 16 + React 19
- **ฐานข้อมูล**: MongoDB + Mongoose
- **ระบบยืนยันตัวตน**: NextAuth.js

## 🎯 ฟีเจอร์หลัก

- **แสดงสินค้า**: สไลด์โชว์รูปสินค้า 5 แบบหลัก + พิเศษ
- **ตารางไซส์**: ตารางขนาดเสื้อ SSS-10XL พร้อมมิติข้อมูล
- **ระบบสต็อก**: แสดงจำนวนเสื้อแต่ละแบบและขนาดแบบ real-time
- **สถิติ**: นับจำนวนเสื้อทั้งหมด และออร์เดอร์ทั้งหมด
- **ระบบสั่งซื้อ**: ผู้ใช้ต้องเข้าสู่ระบบก่อนสั่งซื้อ
- **Dark Mode**: รองรับ light/dark theme
- **Responsive**: ออกแบบสำหรับมือถือและเดสก์ทอป

## 📦 สินค้า

- **ประเภท**: ปกติ, ขาวดำ, พิเศษ
- **ไซส์**: SSS, SS, S, M, L, XL, 2XL-10XL
- **ค่าส่ง**: ตัวแรก 50 บาท ตัวต่อไป +10 บาท

## 📁 โครงสร้างโปรเจค

```
web_next/
├── app/                    # App Router
│   ├── page.tsx           # หน้าหลัก
│   ├── layout.tsx         # Layout หลัก
│   ├── admin/             # หน้า Admin
│   ├── profile/           # โปรไฟล์ผู้ใช้
│   ├── select-products/   # เลือกสินค้า
│   ├── buyer-information/ # ข้อมูลผู้ซื้อ
│   └── components/        # Components ต่างๆ
├── pages/                  # API Routes
├── models/                 # Database Models (Mongoose)
├── lib/                    # Utility Functions
├── public/                 # Static Files
└── styles/                 # CSS Modules
```

## 🔌 Dependencies

- **next-auth**: ระบบยืนยันตัวตน
- **mongoose**: ODM สำหรับ MongoDB
- **bcryptjs**: Hashing รหัสผ่าน
- **next-themes**: Dark mode support
- **react-slick**: Carousel/Slider
- **dotenv**: Environment Variables

## 📝 หมายเหตุ

ปัจจุบันเชื่อมต่อ MongoDB ผ่าน Mongoose และใช้ NextAuth สำหรับจัดการผู้ใช้

## 📸 UI Preview

(./docs/images/ui1.png)
(./docs/images/ui2.png)
(./docs/images/ui3.png)
(./docs/images/ui4.png)
(./docs/images/ui5.png)
(./docs/images/ui6.png)
(./docs/images/ui7.png)
(./docs/images/ui8.png)
