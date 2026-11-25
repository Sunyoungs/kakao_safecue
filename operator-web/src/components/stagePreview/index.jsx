import styles from './stagePreview.module.css';

function StagePreview({ languageLabel = '한국어', text }) {
  return (
    <div className={styles.screen}>
      <span className={styles.chip}>{languageLabel}</span>
      <p className={styles.text}>{text}</p>
    </div>
  );
}

export default StagePreview;