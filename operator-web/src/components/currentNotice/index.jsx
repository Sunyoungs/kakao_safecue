import { useState } from 'react';
import Button from '../button';
import EmptyBox from '../emptyBox';
import useNow from '../../hooks/useNow';
import { INTENT_LABELS, formatCountdown, formatKst } from '../../utils/notice';
import styles from './currentNotice.module.css';

const LANG_TABS = [
  { code: 'ko', label: '한국어 쉬운 글', key: 'text_easy' },
  { code: 'en', label: 'English', key: 'text_en' },
  { code: 'ja', label: '日本語', key: 'text_ja' },
  { code: 'zh', label: '中文', key: 'text_zh' },
];

function CurrentNotice({ notice, audienceCount, isEnding, onEnd }) {
  const [lang, setLang] = useState('ko');
  const isLive = Boolean(notice);
  const hasTimer = notice?.widget === 'timer' && Boolean(notice?.expires_at);
  const now = useNow(1000, hasTimer);
  const activeTab = LANG_TABS.find((t) => t.code === lang);

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>현재 송출 중인 공지</h2>
          {isLive ? (
            <span className={styles.liveBadge}>
              <i className={styles.liveDot} />
              송출 중
            </span>
          ) : (
            <span className={styles.idleBadge}>
              <i className={styles.idleDot} />
              대기 중
            </span>
          )}
        </div>
        <div className={styles.actions}>
          <Button variant="outline" size="sm" disabled={!isLive}>
            정정
          </Button>
          <Button variant="outline" size="sm" disabled={!isLive || isEnding} onClick={onEnd}>
            {isEnding ? '종료 중...' : '공지 종료'}
          </Button>
        </div>
      </header>

      {isLive ? (
        <>
          <div className={styles.metaRow}>
            <span className={styles.tag}>
              {INTENT_LABELS[notice.intent_type] ?? '공지'}
            </span>
            {notice.revision > 0 && <span className={styles.tag}>정정됨</span>}
            <span className={styles.meta}>
              {formatKst(notice.created_at, true)} 송출 · 수신 기기 {audienceCount ?? '-'}대
            </span>
          </div>

          {hasTimer && (
            <div className={styles.remain}>
              <span className={styles.remainLabel}>남은 시간</span>
              <strong className={styles.remainValue}>
                {formatCountdown(notice.expires_at, now)}
              </strong>
            </div>
          )}

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
            <p className={styles.subtitleText}>
              {notice[activeTab.key] || '(번역이 없습니다)'}
            </p>
          </div>
        </>
      ) : (
        <EmptyBox
          minHeight={130}
          title="현재 송출 중인 공지가 없어요"
          description="AI 추천 템플릿이나 수동 송출로 공지를 보낼 수 있어요"
        />
      )}
    </section>
  );
}

export default CurrentNotice;