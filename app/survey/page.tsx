import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'แบบสอบถาม | เว็บไซต์ของเรา',
  description: 'แบบสอบถามเพื่อปรับปรุงการให้บริการ',
};

export default function SurveyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>แบบสอบถาม</h1>
        <p className={styles.subtitle}>ความคิดเห็นของคุณมีความสำคัญต่อการพัฒนาเว็บไซต์ของเรา</p>
        
        <form className={styles.surveyForm}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>ข้อมูลทั่วไป</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">ชื่อและนามสกุล</label>
              <input className={styles.input} type="text" id="name" name="name" required />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">อีเมล</label>
              <input className={styles.input} type="email" id="email" name="email" required />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="age">ช่วงอายุ</label>
              <select className={styles.select} id="age" name="age" required>
                <option value="">กรุณาเลือก</option>
                <option value="18-25">18-25 ปี</option>
                <option value="26-35">26-35 ปี</option>
                <option value="36-45">36-45 ปี</option>
                <option value="46-55">46-55 ปี</option>
                <option value="56+">56 ปีขึ้นไป</option>
              </select>
            </div>
          </div>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>ความพึงพอใจ</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>คุณพึงพอใจกับเว็บไซต์ของเรามากน้อยแค่ไหน?</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input className={styles.radio} type="radio" name="satisfaction" value="5" required />
                  <span>มากที่สุด</span>
                </label>
                <label className={styles.radioLabel}>
                  <input className={styles.radio} type="radio" name="satisfaction" value="4" />
                  <span>มาก</span>
                </label>
                <label className={styles.radioLabel}>
                  <input className={styles.radio} type="radio" name="satisfaction" value="3" />
                  <span>ปานกลาง</span>
                </label>
                <label className={styles.radioLabel}>
                  <input className={styles.radio} type="radio" name="satisfaction" value="2" />
                  <span>น้อย</span>
                </label>
                <label className={styles.radioLabel}>
                  <input className={styles.radio} type="radio" name="satisfaction" value="1" />
                  <span>น้อยที่สุด</span>
                </label>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>คุณพบเว็บไซต์ของเราได้อย่างไร?</label>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input className={styles.checkbox} type="checkbox" name="found" value="search" />
                  <span>การค้นหา (Google, Bing)</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input className={styles.checkbox} type="checkbox" name="found" value="social" />
                  <span>โซเชียลมีเดีย</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input className={styles.checkbox} type="checkbox" name="found" value="friend" />
                  <span>เพื่อนแนะนำ</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input className={styles.checkbox} type="checkbox" name="found" value="advertisement" />
                  <span>โฆษณา</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input className={styles.checkbox} type="checkbox" name="found" value="other" />
                  <span>อื่นๆ</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>ข้อเสนอแนะ</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="improvement">สิ่งใดที่คุณอยากให้เราปรับปรุง?</label>
              <textarea className={styles.textarea} id="improvement" name="improvement" rows={4}></textarea>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="comments">ความคิดเห็นเพิ่มเติม</label>
              <textarea className={styles.textarea} id="comments" name="comments" rows={4}></textarea>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input className={styles.checkbox} type="checkbox" name="newsletter" />
              <span>ฉันต้องการรับข่าวสารและโปรโมชั่นจากเว็บไซต์</span>
            </label>
          </div>
          
          <button className={styles.button} type="submit">ส่งแบบสอบถาม</button>
        </form>
      </div>
    </div>
  );
}