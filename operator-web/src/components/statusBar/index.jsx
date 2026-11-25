import MicSelect from '../micSelect';
import styles from './statusBar.module.css';

const SERVER = {
  connected: { label: '서버 연결됨', tone: 'on' },
  checking: { label: '서버 확인 중', tone: 'off' },
  disconnected: { label: '서버 연결 끊김', tone: 'error' },
};

const MIC = {
  connected: { label: '마이크 연결됨', tone: 'on' },
  requesting: { label: '마이크 연결 중', tone: 'off' },
  idle: { label: '마이크 대기', tone: 'off' },
  error: { label: '마이크 연결 끊김', tone: 'error' },
};

function Indicator({ label, tone }) {
  return (
    <span className={`${styles.item} ${tone === 'error' ? styles.itemError : ''}`}>
      <i
        className={`${styles.dot} ${
          tone === 'on' ? styles.dotOn : tone === 'error' ? styles.dotError : ''
        }`}
      />
      {label}
    </span>
  );
}

function StatusBar({ serverStatus, micStatus, devices, deviceId, onSelectDevice }) {
  return (
    <div className={styles.status}>
      <Indicator {...SERVER[serverStatus]} />
      <Indicator {...MIC[micStatus]} />
      <MicSelect devices={devices} deviceId={deviceId} onSelect={onSelectDevice} />
    </div>
  );
}

export default StatusBar;