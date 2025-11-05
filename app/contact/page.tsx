import styles from "./page.module.css";

export default function Contact() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Contact Us</h1>
        
        <div className={styles.contactInfo}>
          <div className={styles.infoSection}>
            <h2 className={styles.subtitle}>Get in Touch</h2>
            <p className={styles.text}>
              We'd love to hear from you! Whether you have a question, feedback, or want to 
              discuss a project, feel free to reach out to us.
            </p>
          </div>
          
          <div className={styles.contactDetails}>
            <div className={styles.contactItem}>
              <h3 className={styles.itemTitle}>Email</h3>
              <p className={styles.itemText}>info@mywebsite.com</p>
            </div>
            
            <div className={styles.contactItem}>
              <h3 className={styles.itemTitle}>Phone</h3>
              <p className={styles.itemText}>+1 (555) 123-4567</p>
            </div>
            
            <div className={styles.contactItem}>
              <h3 className={styles.itemTitle}>Address</h3>
              <p className={styles.itemText}>
                123 Web Street<br />
                Digital City, DC 12345<br />
                United States
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.formSection}>
          <h2 className={styles.subtitle}>Send us a Message</h2>
          <form className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input type="text" id="name" name="name" className={styles.input} required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input type="email" id="email" name="email" className={styles.input} required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.label}>Subject</label>
              <input type="text" id="subject" name="subject" className={styles.input} required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Message</label>
              <textarea id="message" name="message" className={styles.textarea} rows={5} required></textarea>
            </div>
            
            <button type="submit" className={styles.button}>Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}