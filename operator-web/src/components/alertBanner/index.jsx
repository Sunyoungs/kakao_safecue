import Button from '../button';
import alertIcon from '../../assets/alert_warning.svg';
import closeIcon from '../../assets/alert_close.svg';
import styles from './alertBanner.module.css';

function AlertBanner({ message, actionLabel, onAction, onClose }) {
  return (
    <div className={styles.banner} role="alert">
      <img src={alertIcon} alt="" className={styles.icon} />
      <span className={styles.message}>{message}</span>
      {actionLabel && (
        <Button variant="outline" size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
      <button type="button" className={styles.close} onClick={onClose} aria-label="닫기">
        <img src={closeIcon} alt="" className={styles.closeIcon} />
      </button>
    </div>
  );
}

export default AlertBanner;