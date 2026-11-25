import chevronRight from '../../assets/chevron_right.svg';
import styles from './liveCapture.module.css';

const LEVEL_BARS = Array.from({ length: 8 });

function LiveCapture({ enabled, onToggle, logs }) {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          실시간 수음
          <img src={chevronRight} alt="" className={styles.chevron} />
        </h2>

        <div className={styles.controls}>
          <span className={styles.levelLabel}>수음 전</span>
          <div className={styles.levels}>
            {LEVEL_BARS.map((_, i) => (
              <span
                key={i}
                className={`${styles.bar} ${enabled && i < 3 ? styles.barOn : ''}`}
              />
            ))}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            className={`${styles.switch} ${enabled ? styles.switchOn : ''}`}
            onClick={onToggle}
          >
            <span className={styles.knob} />
          </button>
          <span className={styles.switchLabel}>{enabled ? 'ON' : 'OFF'}</span>
        </div>
      </header>

      {enabled ? (
        <ul className={styles.logList}>
          {logs.map((log) => (
            <li key={log.id} className={styles.logItem}>
              <span className={styles.logTime}>{log.time}</span>
              <span className={styles.logText}>{log.text}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.off}>수음 기능이 꺼져있어요</div>
      )}
    </section>
  );
}

export default LiveCapture;