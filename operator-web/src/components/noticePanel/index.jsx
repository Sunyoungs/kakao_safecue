import { useEffect, useMemo, useState } from 'react';
import Button from '../button';
import EmptyBox from '../emptyBox';
import closeIcon from '../../assets/notice_close.svg';
import warningIcon from '../../assets/warning.svg';
import useNow from '../../hooks/useNow';
import { sendNotice } from '../../api/noticeApi';
import {
  INTENT_LABELS,
  calcEndTime,
  fillPlaceholders,
  formatKst,
  minutesLeft,
} from '../../utils/notice';
import { getPictogram } from '../../utils/pictogram';
import styles from './noticePanel.module.css';

const LANG_TABS = [
  { code: 'ko', label: '한국어 쉬운 글', key: 'text_easy' },
  { code: 'en', label: 'English', key: 'text_en' },
  { code: 'ja', label: '日本語', key: 'text_ja' },
  { code: 'zh', label: '中文', key: 'text_zh' },
];

const isEmergency = (t) => t.intent_type === 'FIRE' || t.trigger_haptic;

function NoticePanel({ suggestions = [], transcripts = [], onSent, onClose }) {
  const [mode, setMode] = useState('ai'); // 'ai' | 'manual'
  const [selectedId, setSelectedId] = useState(null);
  const [lang, setLang] = useState('ko');
  const [minutesInput, setMinutesInput] = useState({}); 
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const now = useNow(15000);

  useEffect(() => {
    if (suggestions.length === 0) {
      setSelectedId(null);
    } else if (!suggestions.some((s) => s.suggestion_id === selectedId)) {
      setSelectedId(suggestions[0].suggestion_id);
    }
  }, [suggestions, selectedId]);

  const selected = suggestions.find((s) => s.suggestion_id === selectedId) || null;
  const template = selected?.template ?? null;
  const isTimer = template?.widget === 'timer';
  const hasEmergency = suggestions.some((s) => isEmergency(s.template));

  const minutesValue = selected
    ? minutesInput[selected.suggestion_id] ?? String(template.default_minutes ?? '')
    : '';
  const minutesNum = Number(minutesValue);
  const validMinutes = Number.isInteger(minutesNum) && minutesNum > 0;
  const endTime = isTimer && validMinutes ? calcEndTime(minutesNum, new Date(now)) : '';

  const activeTab = LANG_TABS.find((t) => t.code === lang);
  const previewText = template
    ? fillPlaceholders(template[activeTab.key], {
        minutes: isTimer && validMinutes ? String(minutesNum) : '',
        endTime,
      }) || '(번역이 없습니다)'
    : '';

  function cardText(t) {
    const m = t.default_minutes;
    return fillPlaceholders(t.text_ko, {
      minutes: m ? String(m) : '',
      endTime: m ? calcEndTime(m, new Date(now)) : '',
    });
  }

  async function handleSend() {
    if (!selected || (isTimer && !validMinutes)) return;
    setIsSending(true);
    setError('');
    try {
      const notice = await sendNotice({
        template_code: template.code,
        ...(isTimer && { minutes: minutesNum }),
      });
      onSent(notice, selected.suggestion_id);
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
          <Button variant={mode === 'ai' ? 'dark' : 'outline'} size="sm" onClick={() => setMode('ai')}>
            AI 자동 송출
          </Button>
          <Button variant={mode === 'manual' ? 'dark' : 'outline'} size="sm" onClick={() => setMode('manual')}>
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

            {suggestions.length === 0 ? (
              <EmptyBox
                minHeight={110}
                title="AI가 현장 음성을 듣고 있어요"
                description="공지가 필요한 상황이 감지되면 여기에 추천 카드가 나타나요"
              />
            ) : (
              <>
                <div className={styles.cards}>
                  {suggestions.map((s) => {
                    const t = s.template;
                    const source = transcripts.find((x) => x.id === s.source_transcript_id);
                    return (
                      <button
                        key={s.suggestion_id}
                        type="button"
                        className={`${styles.card} ${
                          s.suggestion_id === selectedId ? styles.cardSelected : ''
                        }`}
                        onClick={() => setSelectedId(s.suggestion_id)}
                      >
                        <div className={styles.cardTop}>
                          <span
                            className={`${styles.cardTag} ${
                              isEmergency(t) ? styles.tagDanger : styles.tagNormal
                            }`}
                          >
                            {INTENT_LABELS[t.intent_type] ?? t.title}
                          </span>
                          <span className={styles.cardTime}>
                            {formatKst(s.detected_at, true)} 감지
                          </span>
                        </div>
                        <p className={styles.cardBody}>{cardText(t)}</p>
                        {source && <p className={styles.cardSource}>"{source.text}"</p>}
                        <p className={styles.cardExpire}>
                          {minutesLeft(s.expires_at, now)}분 후 사라짐
                        </p>
                      </button>
                    );
                  })}
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
                      src={getPictogram(template.pictogram, template.widget)}
                      alt=""
                      className={styles.previewIcon}
                    />
                    {isTimer && (
                      <div className={styles.timerBox}>
                        <strong>
                          {validMinutes ? `${String(minutesNum).padStart(2, '0')}:00` : '--:--'}
                        </strong>
                        <span>남음</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.previewRight}>
                    <p className={styles.previewText}>{previewText}</p>
                    <Button variant="dark" size="sm" className={styles.editBtn}>
                      텍스트 수정
                    </Button>
                  </div>
                </div>

                {isTimer && (
                  <div className={styles.timeGrid}>
                    <label className={styles.field}>
                      <span>시간 (분)</span>
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={minutesValue}
                        onChange={(e) =>
                          setMinutesInput((prev) => ({
                            ...prev,
                            [selected.suggestion_id]: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className={styles.field}>
                      <span>끝나는 시각</span>
                      <input type="text" value={endTime || '-'} disabled readOnly />
                    </label>
                  </div>
                )}
              </>
            )}

            {error && <p className={styles.error}>{error}</p>}
          </>
        )}
      </div>

      <footer className={styles.footer}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={mode === 'manual' || !selected || (isTimer && !validMinutes) || isSending}
          onClick={handleSend}
        >
          {isSending ? '송출 중...' : '송출'}
        </Button>
      </footer>
    </section>
  );
}

export default NoticePanel;