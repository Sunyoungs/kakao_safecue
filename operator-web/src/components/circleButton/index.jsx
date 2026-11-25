import styles from './circleButton.module.css';

function CircleControlButton({ icon, innerText, label, bare = false, isActive = false, onClick }) {
  const buttonClass = bare
    ? `${styles.bareButton} ${isActive ? styles.bareActive : ''}`
    : `${styles.button} ${isActive ? styles.active : ''}`;

  return (
    <div className={styles.wrapper}>
      <button type="button" className={buttonClass} onClick={onClick}>
        {innerText ? (
          <span className={styles.innerText}>{innerText}</span>
        ) : (
          <img
            src={icon}
            alt=""
            className={bare ? styles.bareIcon : styles.icon}
          />
        )}
      </button>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default CircleControlButton;