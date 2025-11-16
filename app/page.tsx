"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const sliderImages = [
    "/images/V1.png",
    "/images/V2.png",
    "/images/V3.png",
    "/images/V4.png",
    "/images/V5.png",
    "/images/Premium.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Slider Auto
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
        setFade(true);
      }, 300);
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
          <div className={styles.imageWrapper}>
            <Image
              src={sliderImages[currentImageIndex]}
              alt={`Product ${currentImageIndex + 1}`}
              fill
              style={{ objectFit: "contain" }}
              className={fade ? styles.fadeIn : styles.fadeOut}
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

        {/* Right Section */}
        <div className={styles.right}>
          
          <h2 className={styles.productTitle}>SPVV CLOTHING</h2>
          <p className={styles.price}>2,250 ฿ THB</p>

          <Link href="/about" className={styles.primaryButton}>
            สั่งซื้อเสื้อ
          </Link>

          <div className={styles.description}>
            <p>
              SPVV CLOTHING เป็นเว็บไซต์จำหน่ายเสื้อคุณภาพดีที่เหมาะกับทุกโอกาส
              ไม่ว่าจะเป็นใส่เที่ยวหรือใส่กิจกรรมต่างๆ เสื้อของเราเป็นโปโลเกรดพรีเมี่ยม
              มีให้เลือก 5 แบบหลัก พร้อมแบบพิเศษ และลายสะสม
            </p>
            <p>ค่าจัดส่ง: ตัวแรก 50 บาท ตัวต่อไป +10 บาท</p>
            <p>SHIPPING 50 THB FIRST ITEM / 10 THB EACH EXTRA</p>
          </div>

          {/* SIZE TABLE */}
          <div className={styles.sizeTableSection}>
            <h3>ตารางไซส์ SIZE TABLE</h3>
            <div className={styles.tableWrapper}>
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
                    <td>รอบอก</td><td>34</td><td>36</td><td>38</td><td>40</td><td>42</td><td>44</td>
                    <td>46</td><td>48</td><td>50</td><td>52</td><td>54</td><td>56</td>
                  </tr>
                  <tr>
                    <td>ความยาว</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td>
                    <td>30</td><td>31</td><td>32</td><td>33</td><td>34</td><td>35</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 🎉 STOCK TABLE เพิ่มใหม่ */}
          <div className={styles.stockTableSection}>
            <h3>จำนวนสินค้าแต่ละแบบ (STOCK)</h3>

            <div className={styles.tableWrapper}>
              <table className={styles.sizeTable}>
                <thead>
                  <tr>
                    <th>ประเภท</th>
                    <th>SSS</th><th>SS</th><th>S</th><th>M</th><th>L</th><th>XL</th>
                    <th>2XL</th><th>3XL</th><th>4XL</th><th>5XL</th><th>7XL</th><th>8XL</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>ปกติ</td>
                    <td>10</td><td>12</td><td>8</td><td>7</td><td>5</td><td>4</td>
                    <td>6</td><td>9</td><td>11</td><td>7</td><td>3</td><td>2</td>
                  </tr>

                  <tr>
                    <td>ขาวดำ</td>
                    <td>14</td><td>15</td><td>13</td><td>12</td><td>10</td><td>9</td>
                    <td>8</td><td>10</td><td>12</td><td>11</td><td>7</td><td>5</td>
                  </tr>

                  <tr>
                    <td>พิเศษ</td>
                    <td>6</td><td>7</td><td>5</td><td>4</td><td>4</td><td>3</td>
                    <td>6</td><td>8</td><td>9</td><td>6</td><td>4</td><td>3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsSection}>
            <div className={styles.statCard}>
              <h4>31619 ตัว</h4>
              <p>เสื้อทั้งหมด</p>
            </div>
            <div className={styles.statCard}>
              <h4>1899 ออร์เดอร์</h4>
              <p>จำนวนออร์เดอร์</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
