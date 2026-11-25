import { useEffect, useMemo, useState } from 'react';
import Button from '../button';
import closeIcon from '../../assets/notice_close.svg';
import warningIcon from '../../assets/warning.svg';
import stopwatchIcon from '../../assets/test_stopwatch.svg';
import { fetchRecommendedTemplates, sendNotice } from '../../api/noticeApi';
import styles from './noticePanel.module.css';

const LANG_TABS = [
  { code: 'ko', label: '한국어 쉬운 글' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

function diffMinutes(start, end) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if ([sh, sm, eh, em].some(Number.isNaN)) return null;
  let diff = eh * 60 + em - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;
  return diff;
}

function NoticePanel({ onClose }) {
  const [mode, setMode] = useState('ai'); // 'ai' | 'manual'
  const [templates, setTemplates] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [lang, setLang] = useState('ko');
  const [startTime, setStartTime] = useState('19:50');
  const [endTime, setEndTime] = useState('20:05');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchRecommendedTemplates()
      .then((data) => {
        if (cancelled) return;
        setTemplates(data);
        if (data.length > 0) setSelectedId(data[0].id);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = templates.find((t) => t.id === selectedId) || null;
  const hasEmergency = templates.some((t) => t.tone === 'danger');

  const totalLabel = useMemo(() => {
    const minutes = diffMinutes(startTime, endTime);
    return minutes === null ? '-' : `${minutes}분`;
  }, [startTime, endTime]);

  async function handleSend() {
    if (!selected) return;
    setIsSending(true);
    setError('');
    try {
      await sendNotice({
        templateId: selected.id,
        startTime,
        endTime,
      });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <h2 className={styles.title}>공지 송출</h2>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
          <img src={closeIcon} alt="" className={styles.closeIcon} />
        </button>
      </header>

      <div className={styles.body}>
        <div className={styles.modeTabs}>
          <Button
            variant={mode === 'ai' ? 'dark' : 'outline'}
            size="sm"
            onClick={() => setMode('ai')}
          >
            AI 자동 송출
          </Button>
          <Button
            variant={mode === 'manual' ? 'dark' : 'outline'}
            size="sm"
            onClick={() => setMode('manual')}
          >
            수동 송출
          </Button>
        </div>

        {mode === 'manual' ? (
          <div className={styles.placeholder}>수동 송출은 준비 중입니다.</div>
        ) : (
          <>
            <div className={styles.sectionHead}>
              <h3 className={styles.sectionTitle}>AI 추천 템플릿</h3>
              {hasEmergency && (
                <span className={styles.alert}>
                  <img src={warningIcon} alt="" className={styles.alertIcon} />
                  비상 상황 감지
                </span>
              )}
            </div>

            <div className={styles.cards}>
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`${styles.card} ${t.id === selectedId ? styles.cardSelected : ''}`}
                  onClick={() => setSelectedId(t.id)}
                >
                  <div className={styles.cardTop}>
                    <span
                      className={`${styles.cardTag} ${
                        t.tone === 'danger' ? styles.tagDanger : styles.tagNormal
                      }`}
                    >
                      {t.label}
                    </span>
                    <span className={styles.cardTime}>{t.detectedAt} 감지</span>
                  </div>
                  <p className={styles.cardBody}>{t.body}</p>
                  <p className={styles.cardSource}>{t.source}</p>
                </button>
              ))}
            </div>

            <h3 className={styles.sectionTitle}>송출 미리보기 및 수정</h3>

            <div className={styles.langTabs}>
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

            <div className={styles.preview}>
              <div className={styles.previewLeft}>
                <img
                  src={selected?.timer ? stopwatchIcon : warningIcon}
                  alt=""
                  className={styles.previewIcon}
                />
                {selected?.timer && (
                  <div className={styles.timerBox}>
                    <strong>{selected.timer}</strong>
                    <span>남음</span>
                  </div>
                )}
              </div>
              <div className={styles.previewRight}>
                <p className={styles.previewText}>{selected ? selected.preview[lang] : ''}</p>
                <Button variant="dark" size="sm" className={styles.editBtn}>
                  텍스트 수정
                </Button>
              </div>
            </div>

            <div className={styles.timeGrid}>
              <label className={styles.field}>
                <span>시작 시간</span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span>종료 시간</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span>총 시간</span>
                <input type="text" value={totalLabel} disabled readOnly />
              </label>
            </div>

            {error && <p className={styles.error}>{error}</p>}
          </>
        )}
      </div>

      <footer className={styles.footer}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={mode === 'manual' || !selected || isSending}
          onClick={handleSend}
        >
          {isSending ? '송출 중...' : '송출'}
        </Button>
      </footer>
    </section>
  );
}

export default NoticePanel;