import noticeIcon from '../../assets/notice.svg';
import styles from './noticeButton.module.css';

function NoticeButton({ onClick }) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <img src={noticeIcon} alt="" className={styles.icon} />
      <span>지난 공지</span>
    </button>
  );
}

export default NoticeButton;