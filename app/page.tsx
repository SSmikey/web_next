import styles from "./page.module.css";
import Lantern from "./components/Lantern";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Floating Lanterns */}
      <Lantern delay={0} duration={20} left={10} />
      <Lantern delay={5} duration={25} left={30} />
      <Lantern delay={10} duration={18} left={50} />
      <Lantern delay={3} duration={22} left={70} />
      <Lantern delay={8} duration={20} left={85} />
      
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome to MyWebsite</h1>
        <p className={styles.subtitle}>
          Creating amazing digital experiences that make a difference
        </p>
        <div className={styles.buttons}>
          <a href="/about" className={styles.primaryButton}>Learn More</a>
          <a href="/contact" className={styles.secondaryButton}>Contact Us</a>
        </div>
      </div>
      
      <div className={styles.features}>
        <h2 className={styles.sectionTitle}>Our Services</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <h3 className={styles.featureTitle}>Web Development</h3>
            <p className={styles.featureText}>
              Building responsive, fast, and user-friendly websites using the latest technologies.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3 className={styles.featureTitle}>UI/UX Design</h3>
            <p className={styles.featureText}>
              Creating beautiful and intuitive interfaces that delight users and drive engagement.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📱</div>
            <h3 className={styles.featureTitle}>Mobile Apps</h3>
            <p className={styles.featureText}>
              Developing native and cross-platform mobile applications for iOS and Android.
            </p>
          </div>
        </div>
      </div>
      
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to start your project?</h2>
        <p className={styles.ctaText}>
          Let's work together to bring your ideas to life. Get in touch with us today!
        </p>
        <a href="/contact" className={styles.ctaButton}>Get Started</a>
      </div>
    </div>
  );
}
