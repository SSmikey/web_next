"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.title}>SPVV CLOTHING</h1>
        <p className={styles.subtitle}>WELCOME TO MY WEBSITE</p>

        <div className={styles.buttons}>
          <Link href="/contact" className={styles.primaryButton}>
            สั่งซื้อเสื้อ
          </Link>
          <Link href="/about" className={styles.secondaryButton}>
            ดูสถิติการขาย
          </Link>
        </div>
      </div>

      {/* Product Section */}
      <div className={styles.productLayout}>

        {/* Left Column */}
        <div className={styles.leftColumn}>

          {/* Product Image (Hover Switch) */}
          <div className={styles.productImageBox}>
            
            <div className={styles.imageHoverBox}>
              <Image
                src="/spwv.jpg"
                alt="SPVV Front"
                width={400}
                height={400}
                className={`${styles.hoverImage} ${styles.frontImage}`}
              />

              <Image
                src="/4spvv.jpg"
                alt="SPVV Back"
                width={400}
                height={400}
                className={`${styles.hoverImage} ${styles.backImage}`}
              />
            </div>

            <p>รูปภาพสินค้า(ไม่รู้จะเอาอะไรใส่ดี)</p>
          </div>

          {/* Size Table */}
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
                  <td>34</td><td>36</td><td>38</td><td>40</td><td>42</td>
                  <td>44</td><td>46</td><td>48</td><td>50</td><td>52</td>
                  <td>54</td><td>56</td>
                </tr>
                <tr>
                  <td>ความยาว(นิ้ว)</td>
                  <td>24</td><td>25</td><td>26</td><td>27</td><td>28</td>
                  <td>29</td><td>30</td><td>31</td><td>32</td><td>33</td>
                  <td>34</td><td>35</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Order Channels */}
          <div className={styles.orderChannels}>
            <h3>สั่งซื้อได้ 2 ช่องทาง</h3>

            <div className={styles.qrSection}>
              <div className={styles.qrBox}>
                <div className={styles.qrPlaceholder}>QR 1</div>
                <p>LINE @ ไลน์ใครก็ใส่ไป</p>
              </div>

              <div className={styles.qrBox}>
                <div className={styles.qrPlaceholder}>QR 2</div>
                <p>SCAN เพื่อจ่ายเงิน</p>
              </div>
            </div>

            <div className={styles.priceInfo}>
              <h4>เสื้อ 243</h4>
              <p>แบบสี / แบบโพกศว</p>
              <p className={styles.shippingPrice}>ค่าจัดส่ง</p>
              <p>ตัวแรก 50 บาท</p>
              <p>ตัวต่อไป เพิ่มตัวละ 10 บาท</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.productInfo}>
            
            <h2 className={styles.productTitle}>SPVV CLOTHING</h2>
          
            <div className={styles.subtitle} style={{ color: "#000" }}>
              <p>2,250 ฿ THB</p>
            </div>

            <div
              className={styles.buttons}
              style={{ justifyContent: "flex-start", marginBottom: "30px" }}
            >
              <Link href="/contact" className={styles.primaryButton}>
                สั่งซื้อเสื้อ
              </Link>
            </div>

            <div className={styles.description}>
              <p>
                SPVV CLOTHING เป็นเว็บไซต์จำหน่ายเสื้อคุณภาพดีที่ออกแบบมาให้เหมาะกับทุกโอกาส...
              </p>
              <p>
                ปัจจุบันเรามี 5 แบบหลัก พร้อมแบบพิเศษ ขาวดำอีก 5 แบบ...
              </p>
              <p>ค่าจัดส่ง: ตัวแรก 50 บาท ตัวต่อไปเพิ่ม 10 บาทต่อชิ้น</p>
              <p>SHIPPING: 50 THB FOR THE FIRST ITEM 10 THB FOR EACH ADDITIONAL ITEM</p>
            </div>

            <h3 className={styles.statsHeader}>สถิติการขายเสื้อ</h3>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h4>31619 ตัว</h4>
                <p>เสื้อทั้งหมด (รวมทั้งสิ้น)</p>
              </div>

              <div className={styles.statCard}>
                <h4>1899 ออร์เดอร์</h4>
                <p>จำนวนออร์เดอร์ (รวมทั้งสิ้น)</p>
              </div>
            </div>

            <div className={styles.shirtTypes}>
              <div className={styles.shirtTypeCard}>
                <h4>เสื้อแบบที่1</h4>
                <p>เสื้อทั้งหมด: 27328 ตัว</p>
                <p>จำนวนออร์เดอร์: 1520 รายการ</p>
              </div>

              <div className={styles.shirtTypeCard}>
                <h4>เสื้อแบบที่2</h4>
                <p>เสื้อทั้งหมด: 4291 ตัว</p>
                <p>จำนวนออร์เดอร์: 379 รายการ</p>
              </div>
            </div>

            <div className={styles.sizeDetail}>
              <p>จำนวนเสื้อแต่ละไซส์ (รวมทั้งสิ้น)</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
