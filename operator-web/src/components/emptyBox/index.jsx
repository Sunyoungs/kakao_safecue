import styles from './emptyBox.module.css';

function EmptyBox({ title, description, tone = 'default', minHeight = 72, children }) {
  return (
    <div
      className={`${styles.box} ${tone === 'error' ? styles.error : ''}`}
      style={{ minHeight }}
    >
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.desc}>{description}</p>}
      {children}
    </div>
  );
}

export default EmptyBox;