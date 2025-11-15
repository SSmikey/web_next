import styles from "./page.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>About Us</h1>
        <div className={styles.section}>
          <h2 className={styles.subtitle}>Our Story</h2>
          <p className={styles.text}>
            Welcome to MyWebsite! We started this journey with a simple mission: to create 
            amazing web experiences that make a difference. Founded in 2023, our team has grown 
            from a small group of passionate developers to a full-service digital agency. ชอบเธอ
            
          </p>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.subtitle}>Our Mission</h2>
          <p className={styles.text}>
            Our mission is to provide innovative solutions that help businesses thrive in the 
            digital world. We believe in creating user-friendly, responsive, and visually 
            appealing websites that deliver results.
          </p>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.subtitle}>Our Team</h2>
          <p className={styles.text}>
            We are a diverse team of designers, developers, and digital strategists who are 
            passionate about what we do. Each team member brings unique skills and perspectives 
            to every project we undertake.
          </p>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.subtitle}>Our Values</h2>
          <ul className={styles.valuesList}>
            <li>Innovation in every project</li>
            <li>Customer satisfaction above all</li>
            <li>Continuous learning and improvement</li>
            <li>Collaboration and teamwork</li>
            <li>Integrity and transparency</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
