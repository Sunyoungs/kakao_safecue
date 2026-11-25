import { useState } from 'react';
import Layout from '../components/layout';
import LiveCapture from '../components/liveCapture';
import StagePreview from '../components/stagePreview';
import CircleControlButton from '../components/circleButton';
import CurrentNotice from '../components/currentNotice';
import SubtitleList from '../components/subtitleList';
import NoticePanel from '../components/noticePanel';
import prevIcon from '../assets/prev.svg';
import nextIcon from '../assets/next.svg';
import blackoutIcon from '../assets/black.svg';
import playIcon from '../assets/start.svg';
import stopIcon from '../assets/stop.svg';
import noticeIcon from '../assets/notice.svg';
import styles from './Dashboard.module.css';

const MOCK_LOGS = [
  { id: 1, time: '19:47:41', text: '네 객석 정리 다 했습니다' },
  { id: 2, time: '19:47:41', text: '네 객석 정리 다 했습니다' },
  { id: 3, time: '19:47:41', text: '네 객석 정리 다 했습니다' },
  { id: 4, time: '19:47:41', text: '네 객석 정리 다 했습니다' },
];

const MOCK_SUBTITLES = [
  {
    id: 1,
    text: '함께 만드는 공연 문화\n중간 퇴장 시, 재입장 불가\n공연 중 전자기기 사용 금지\n대화와 음식 섭취는 삼가주세요',
  },
  {
    id: 2,
    text: '왼쪽 메뉴를 누르시면\n언어를 변경하실 수 있습니다.\n공연 중엔 조작을 삼가해주세요.',
  },
  {
    id: 3,
    text: '함께 만드는 공연 문화\n중간 퇴장 시, 재입장 불가\n공연 중 전자기기 사용 금지\n대화와 음식 섭취는 삼가주세요',
  },
  {
    id: 4,
    text: '왼쪽 메뉴를 누르시면\n언어를 변경하실 수 있습니다.\n공연 중엔 조작을 삼가해주세요.',
  },
  {
    id: 5,
    text: '함께 만드는 공연 문화\n중간 퇴장 시, 재입장 불가\n공연 중 전자기기 사용 금지\n대화와 음식 섭취는 삼가주세요',
  },
];

const MOCK_CURRENT_NOTICE = {
  tag: '인터미션',
  sentAt: '19:50:12',
  deviceCount: 132,
  remaining: '14:52',
  subtitles: {
    ko: '15분 휴식/2부 20:05 시작',
    en: '15-minute break / Act 2 starts at 20:05',
    ja: '15分休憩 / 第2部は20:05開始',
    zh: '休息15分钟 / 第二部20:05开始',
  },
};

const IDLE_SUBTITLE = '어디에서나, 당신의 언어로\n[오늘의 자막, 내일의 문화]\n-UNISTEP-';

function Dashboard() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  return (
    <Layout title="뮤지컬 <레베카>" date="2026.11.12 (목)" activeMenu="play">
      <div className={styles.grid}>
        <section className={styles.left}>
          <LiveCapture
            enabled={isCapturing}
            onToggle={() => setIsCapturing((prev) => !prev)}
            logs={MOCK_LOGS}
          />

          <StagePreview text={IDLE_SUBTITLE} />

          <div className={styles.controls}>
            <CircleControlButton icon={prevIcon} label="이전" bare />
            <CircleControlButton icon={nextIcon} label="다음" bare />
            <CircleControlButton icon={blackoutIcon} label="암전" bare />
            <CircleControlButton icon={playIcon} label="송출 시작" bare />
            <CircleControlButton icon={stopIcon} label="송출 종료" bare />
            <CircleControlButton icon={noticeIcon} label="공지" bare isActive={isNoticeOpen} onClick={() => setIsNoticeOpen(true)} />
          </div>

          <CurrentNotice notice={MOCK_CURRENT_NOTICE} />
        </section>

        <aside className={styles.right}>
          {isNoticeOpen ? (
            <NoticePanel onClose={() => setIsNoticeOpen(false)} />
          ) : (
            <SubtitleList items={MOCK_SUBTITLES} />
          )}
        </aside>
      </div>
    </Layout>
  );
}

export default Dashboard;