import Button from '../button';
import EmptyBox from '../emptyBox';
import chevronRight from '../../assets/chevron_right.svg';
import { BAR_COUNT, MIC_ERROR_MESSAGES } from '../../hooks/useMicrophone';
import styles from './liveCapture.module.css';

const LEVEL_BARS = Array.from({ length: BAR_COUNT });

function LiveCapture({ status, errorType, level, logs, highlightIds = [], onToggle, onRetry }) {
  const isOn = status === 'connected' || status === 'requesting';

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          실시간 수음
          <img src={chevronRight} alt="" className={styles.chevron} />
        </h2>

        <div className={styles.controls}>
          <span className={styles.levelLabel}>{status === 'connected' ? '수음' : '수음 전'}</span>
          <div className={styles.levels}>
            {LEVEL_BARS.map((_, i) => (
              <span
                key={i}
                className={`${styles.bar} ${status === 'connected' && i < level ? styles.barOn : ''}`}
              />
            ))}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isOn}
            className={`${styles.switch} ${isOn ? styles.switchOn : ''}`}
            onClick={onToggle}
          >
            <span className={styles.knob} />
          </button>
          <span className={styles.switchLabel}>{isOn ? 'ON' : 'OFF'}</span>
        </div>
      </header>

      {status === 'connected' && (
        <ul className={styles.logList}>
          {logs.map((log) => (
            <li
              key={log.id}
              className={`${styles.logItem} ${
                highlightIds.includes(log.id) ? styles.logHighlight : ''
              }`}
            >
              <span className={styles.logTime}>{log.time}</span>
              <span className={`${styles.logText} ${log.unclear ? styles.logUnclear : ''}`}>
                {log.unclear ? '[음성 불분명]' : log.text}
              </span>
            </li>
          ))}
        </ul>
      )}

      {status === 'requesting' && <EmptyBox title="마이크를 연결하고 있어요..." />}

      {status === 'error' && (
        <EmptyBox tone="error" title={MIC_ERROR_MESSAGES[errorType] || MIC_ERROR_MESSAGES.unknown}>
          <Button variant="outline" size="sm" onClick={onRetry}>
            다시 시도
          </Button>
        </EmptyBox>
      )}

      {status === 'idle' && <EmptyBox title="수음 기능이 꺼져있어요" />}
    </section>
  );
}

export default LiveCapture;