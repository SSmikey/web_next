import styles from "./Lantern.module.css";

interface LanternProps {
  delay?: number;
  duration?: number;
  left?: number;
}

export default function Lantern({ delay = 0, duration = 15, left = 10 }: LanternProps) {
  return (
    <div 
      className={styles.lanternContainer}
      style={{
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      <div className={styles.lantern}>
        <div className={styles.lanternTop}></div>
        <div className={styles.lanternBody}>
          <div className={styles.lanternLight}></div>
        </div>
        <div className={styles.lanternBottom}></div>
      </div>
    </div>
  );
}