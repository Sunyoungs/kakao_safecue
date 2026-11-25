import closeIcon from '../../assets/close.svg';
import styles from './notice.module.css';

function NoticeHistory({ notices, onClose }) {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>지난 공지</h2>
          <span className={styles.sortLabel}>최신순</span>
        </div>

        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <img src={closeIcon} alt="" className={styles.closeIcon} />
          <span>닫기</span>
        </button>
      </header>

      <ul className={styles.list}>
        {notices.length === 0 ? (
          <li className={styles.empty}>아직 수신된 공지가 없습니다.</li>
        ) : (
          notices.map((item) => (
            <li key={item.id} className={styles.row}>
              <span className={styles.time}>{item.time}</span>
              <div className={styles.iconBox}>
                <span className={styles.iconPlaceholder}>{item.icon}</span>
              </div>
              <div className={styles.content}>
                {item.isCorrected && (
                  <span className={styles.correctedBadge}>정정됨</span>
                )}
                <p className={styles.text}>{item.text}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export default NoticeHistory;