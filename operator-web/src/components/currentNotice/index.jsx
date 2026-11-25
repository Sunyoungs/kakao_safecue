import { useState } from 'react';
import Button from '../button';
import styles from './currentNotice.module.css';

const LANG_TABS = [
  { code: 'ko', label: '한국어 쉬운 글' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

function CurrentNotice({ notice }) {
  const [lang, setLang] = useState('ko');

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>현재 송출 중인 공지</h2>
          <span className={styles.liveBadge}>
            <i className={styles.liveDot} />
            송출 중
          </span>
        </div>
        <div className={styles.actions}>
          <Button variant="outline" size="sm">정정</Button>
          <Button variant="outline" size="sm">공지 종료</Button>
        </div>
      </header>

      <div className={styles.metaRow}>
        <span className={styles.tag}>{notice.tag}</span>
        <span className={styles.meta}>
          {notice.sentAt} 송출 · 수신 기기 {notice.deviceCount}대
        </span>
      </div>

      <div className={styles.remain}>
        <span className={styles.remainLabel}>남은 시간</span>
        <strong className={styles.remainValue}>{notice.remaining}</strong>
      </div>

      <div className={styles.tabs}>
        {LANG_TABS.map((tab) => (
          <Button
            key={tab.code}
            variant={lang === tab.code ? 'dark' : 'outline'}
            size="sm"
            onClick={() => setLang(tab.code)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className={styles.subtitleBox}>
        <span className={styles.subtitleLabel}>관객 화면 자막</span>
        <p className={styles.subtitleText}>{notice.subtitles[lang]}</p>
      </div>
    </section>
  );
}

export default CurrentNotice;