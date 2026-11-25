import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import StatusBar from '../components/statusBar';
import AlertBanner from '../components/alertBanner';
import LiveCapture from '../components/liveCapture';
import StagePreview from '../components/stagePreview';
import CircleControlButton from '../components/circleButton';
import CurrentNotice from '../components/currentNotice';
import SubtitleList from '../components/subtitleList';
import NoticePanel from '../components/noticePanel';
import useMicrophone from '../hooks/useMicrophone';
import useServerStatus from '../hooks/useServerStatus';
import { MOCK_TEMPLATES, endNotice, fetchActiveNotice } from '../api/noticeApi';
import { formatKst } from '../utils/notice';
import prevIcon from '../assets/prev.svg';
import nextIcon from '../assets/next.svg';
import blackoutIcon from '../assets/black.svg';
import playIcon from '../assets/start.svg';
import stopIcon from '../assets/stop.svg';
import noticeIcon from '../assets/notice.svg';
import styles from './Dashboard.module.css';

const MOCK_TRANSCRIPTS = [
  { id: 't1', time: '19:47:41', text: '네 객석 정리 다 했습니다', unclear: false },
  { id: 't2', time: '19:47:48', text: '네 객석 정리 다 했습니다', unclear: false },
  { id: 't3', time: '19:47:55', text: '', unclear: true },
];

const MOCK_SUBTITLES = [
  { id: 1, text: '함께 만드는 공연 문화\n중간 퇴장 시, 재입장 불가\n공연 중 전자기기 사용 금지\n대화와 음식 섭취는 삼가주세요' },
  { id: 2, text: '왼쪽 메뉴를 누르시면\n언어를 변경하실 수 있습니다.\n공연 중엔 조작을 삼가해주세요.' },
  { id: 3, text: '함께 만드는 공연 문화\n중간 퇴장 시, 재입장 불가\n공연 중 전자기기 사용 금지\n대화와 음식 섭취는 삼가주세요' },
  { id: 4, text: '왼쪽 메뉴를 누르시면\n언어를 변경하실 수 있습니다.\n공연 중엔 조작을 삼가해주세요.' },
  { id: 5, text: '함께 만드는 공연 문화\n중간 퇴장 시, 재입장 불가\n공연 중 전자기기 사용 금지\n대화와 음식 섭취는 삼가주세요' },
];

const IDLE_SUBTITLE = '어디에서나, 당신의 언어로\n[오늘의 자막, 내일의 문화]\n-UNISTEP-';
const SUGGESTION_TTL_MS = 5 * 60 * 1000;

function Dashboard() {
  const mic = useMicrophone();
  const server = useServerStatus();

  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [transcripts, setTranscripts] = useState(MOCK_TRANSCRIPTS);
  const [suggestions, setSuggestions] = useState([]); 
  const [currentNotice, setCurrentNotice] = useState(null);
  const [audienceCount, setAudienceCount] = useState(null); 
  const [isEnding, setIsEnding] = useState(false);
  const [isBannerClosed, setIsBannerClosed] = useState(false);

  useEffect(() => {
    if (server.status === 'connected') setIsBannerClosed(false);
  }, [server.status]);

  useEffect(() => {
    if (server.status !== 'connected') return undefined;
    let cancelled = false;
    fetchActiveNotice()
      .then((notice) => {
        if (!cancelled) setCurrentNotice(notice);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [server.status]);

  useEffect(() => {
    if (suggestions.length === 0) return undefined;
    const id = setInterval(() => {
      setSuggestions((prev) => {
        const next = prev.filter((s) => new Date(s.expires_at).getTime() > Date.now());
        return next.length === prev.length ? prev : next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [suggestions.length]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const pushSuggestion = (template, text) => {
      const stamp = Date.now();
      const transcriptId = `t${stamp}`;
      const nowIso = new Date(stamp).toISOString();
      setTranscripts((prev) => [
        ...prev,
        { id: transcriptId, time: formatKst(nowIso, true), text, unclear: false },
      ]);
      setSuggestions([
        {
          suggestion_id: `s${stamp}`,
          template,
          source_transcript_id: transcriptId,
          detected_at: nowIso,
          expires_at: new Date(stamp + SUGGESTION_TTL_MS).toISOString(),
        },
      ]);
    };
    window.__mock = {
      detect: () => pushSuggestion(MOCK_TEMPLATES[1], '잠시 쉬었다가 2부 시작하겠습니다'),
      detectFire: () => pushSuggestion(MOCK_TEMPLATES[0], '불이 났습니다 관객 여러분 비상구로'),
      audience: (n = 132) => setAudienceCount(n),
      clear: () => {
        setSuggestions([]);
        setCurrentNotice(null);
      },
      serverDown: (down = true) => {
        window.__mockServerDown = down;
      },
    };
  }, []);

  const isCapturing = mic.status === 'connected' || mic.status === 'requesting';
  const showBanner = server.status === 'disconnected' && !isBannerClosed;

  function handleToggleCapture() {
    if (isCapturing) mic.stop();
    else mic.start();
  }

  function handleSent(notice, suggestionId) {
    setCurrentNotice(notice);
    setSuggestions((prev) => prev.filter((s) => s.suggestion_id !== suggestionId));
  }

  async function handleEndNotice() {
    if (!currentNotice) return;
    if (!window.confirm('현재 송출 중인 공지를 종료할까요?')) return;
    setIsEnding(true);
    try {
      await endNotice(currentNotice.id);
      setCurrentNotice(null);
    } catch (e) {
      window.alert(e.message); 
    } finally {
      setIsEnding(false);
    }
  }

  return (
    <Layout
      title="뮤지컬 <레베카>"
      date="2026.11.12 (목)"
      activeMenu="play"
      headerRight={
        <StatusBar
          serverStatus={server.status}
          micStatus={mic.status}
          devices={mic.devices}
          deviceId={mic.deviceId}
          onSelectDevice={mic.selectDevice}
        />
      }
      banner={
        showBanner && (
          <AlertBanner
            message="서버 연결이 끊어졌습니다. 네트워크 상태를 확인한 후 다시 연결해주세요."
            actionLabel="다시 연결"
            onAction={server.retry}
            onClose={() => setIsBannerClosed(true)}
          />
        )
      }
    >
      <div className={styles.grid}>
        <section className={styles.left}>
          <LiveCapture
            status={mic.status}
            errorType={mic.errorType}
            level={mic.level}
            logs={transcripts}
            highlightIds={suggestions.map((s) => s.source_transcript_id)}
            onToggle={handleToggleCapture}
            onRetry={() => mic.start()}
          />

          <StagePreview text={IDLE_SUBTITLE} />

          <div className={styles.controls}>
            <CircleControlButton icon={prevIcon} label="이전" bare />
            <CircleControlButton icon={nextIcon} label="다음" bare />
            <CircleControlButton icon={blackoutIcon} label="암전" bare />
            <CircleControlButton icon={playIcon} label="송출 시작" bare />
            <CircleControlButton icon={stopIcon} label="송출 종료" bare />
            <CircleControlButton
              icon={noticeIcon}
              label="공지"
              bare
              isActive={isNoticeOpen}
              onClick={() => setIsNoticeOpen(true)}
            />
          </div>

          <CurrentNotice
            notice={currentNotice}
            audienceCount={audienceCount}
            isEnding={isEnding}
            onEnd={handleEndNotice}
          />
        </section>

        <aside className={styles.right}>
          {isNoticeOpen ? (
            <NoticePanel
              suggestions={suggestions}
              transcripts={transcripts}
              onSent={handleSent}
              onClose={() => setIsNoticeOpen(false)}
            />
          ) : (
            <SubtitleList items={MOCK_SUBTITLES} />
          )}
        </aside>
      </div>
    </Layout>
  );
}

export default Dashboard;