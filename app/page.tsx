"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const sliderImages = [
    "/spwv.jpg",
    "/4spvv.jpg",
    "/images/V3.png",
    "/images/V4.png",
    "/images/V5.png",
    "/images/Premium.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
        setFade(true);
      }, 300); // fade out time
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentImageIndex(
        currentImageIndex === 0 ? sliderImages.length - 1 : currentImageIndex - 1
      );
      setFade(true);
    }, 300);
  };

  const goToNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentImageIndex((currentImageIndex + 1) % sliderImages.length);
      setFade(true);
    }, 300);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Left Image */}
        <div className={styles.left}>
          <div className={`${styles.imageWrapper} ${fade ? styles.fadeIn : styles.fadeOut}`}>
            <Image
              src={sliderImages[currentImageIndex]}
              alt={`Product ${currentImageIndex + 1}`}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
            <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={goToPrevious}>
              ‹
            </button>
            <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={goToNext}>
              ›
            </button>
          </div>
        </div>

        {/* Right Info */}
        <div className={styles.right}>
          <h2 className={styles.productTitle}>SPVV CLOTHING</h2>
          <p className={styles.price}>2,250 ฿ THB</p>
          <Link href="/about" passHref legacyBehavior>
            <a className={styles.primaryButton}>สั่งซื้อเสื้อ</a>
          </Link>

          <div className={styles.description}>
            <p>
              SPVV CLOTHING เป็นเว็บไซต์จำหน่ายเสื้อคุณภาพดีที่ออกแบบมาให้เหมาะกับทุกโอกาส
              ไม่ว่าจะเป็นใส่เที่ยวหรือไปงานกิจกรรมต่างๆ
              เป็นเสื้อโปโลเกรดพรีเมี่ยม ปัจจุบันเรามี 5 แบบหลัก พร้อมแบบพิเศษ
              ขาวดำอีก 5 แบบ และยังมีแบบพิเศษให้สะสม
            </p>
            <p>ค่าจัดส่ง: ตัวแรก 50 บาท ตัวต่อไปเพิ่ม 10 บาทต่อชิ้น</p>
            <p>SHIPPING 50 THB FOR THE FIRST ITEM 10 THB FOR EACH ADDITIONAL ITEM</p>
          </div>

          <div className={styles.sizeTableSection}>
            <h3>ตารางไซส์ SIZE TABLE</h3>
            <table className={styles.sizeTable}>
              <thead>
                <tr>
                  <th>SIZE</th>
                  <th>SSS</th>
                  <th>SS</th>
                  <th>S</th>
                  <th>M</th>
                  <th>L</th>
                  <th>XL</th>
                  <th>2XL</th>
                  <th>3XL</th>
                  <th>4XL</th>
                  <th>5XL</th>
                  <th>7XL</th>
                  <th>8XL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>รอบอก(นิ้ว)</td>
                  <td>34</td>
                  <td>36</td>
                  <td>38</td>
                  <td>40</td>
                  <td>42</td>
                  <td>44</td>
                  <td>46</td>
                  <td>48</td>
                  <td>50</td>
                  <td>52</td>
                  <td>54</td>
                  <td>56</td>
                </tr>
                <tr>
                  <td>ความยาว(นิ้ว)</td>
                  <td>24</td>
                  <td>25</td>
                  <td>26</td>
                  <td>27</td>
                  <td>28</td>
                  <td>29</td>
                  <td>30</td>
                  <td>31</td>
                  <td>32</td>
                  <td>33</td>
                  <td>34</td>
                  <td>35</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.statCard}>
              <h4>31619 ตัว</h4>
              <p>เสื้อทั้งหมด (รวมทั้งสิ้น)</p>
            </div>
            <div className={styles.statCard}>
              <h4>1899 ออร์เดอร์</h4>
              <p>จำนวนออร์เดอร์ (รวมทั้งสิ้น)</p>
            </div>
            <div className={styles.statCard}>
              <h4>เสื้อแบบที่1</h4>
              <p>เสื้อทั้งหมด: 27328 ตัว</p>
              <p>จำนวนออร์เดอร์: 1520 รายการ</p>
            </div>
            <div className={styles.statCard}>
              <h4>เสื้อแบบที่2</h4>
              <p>เสื้อทั้งหมด: 4291 ตัว</p>
              <p>จำนวนออร์เดอร์: 379 รายการ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
