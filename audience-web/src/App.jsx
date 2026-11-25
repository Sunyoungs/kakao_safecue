import { useEffect, useState } from 'react';
import LanguageSelect from './components/language';
import NoticeButton from './components/noticeButton';
import NoticeHistory from './components/notice';
import styles from './App.module.css';

const DEFAULT_SUBTITLE = {
  ko: '어디에서나, 당신의 언어로\n[오늘의 자막, 내일의 문화]\n-UNISTEP-',
  en: 'Anywhere, in your language\n[Today’s Subtitles, Tomorrow’s Culture]\n-UNISTEP-',
  zh: '随时随地，用您的语言\n[今日字幕，明日文化]\n-UNISTEP-',
  ja: 'どこでも、あなたの言葉で\n[今日の字幕、明日の文化]\n-UNISTEP-',
};

const MOCK_PAST_NOTICES = [
  {
    id: 1,
    time: '20:12',
    icon: '📵',
    text: '전자기기 사용 금지',
    isCorrected: false,
  },
  {
    id: 2,
    time: '19:52',
    icon: '⏱️',
    text: '20분 쉬는 시간 · 2부 20:10 시작',
    isCorrected: true,
  },
  {
    id: 3,
    time: '19:31',
    icon: '⏳',
    text: '공연 10분 지연 · 19:40 시작',
    isCorrected: false,
  },
  {
    id: 4,
    time: '20:12',
    icon: '📵',
    text: '전자기기 사용 금지',
    isCorrected: false,
  },
  {
    id: 5,
    time: '19:52',
    icon: '⏱️',
    text: '20분 쉬는 시간 · 2부 20:10 시작',
    isCorrected: true,
  },
  {
    id: 6,
    time: '19:31',
    icon: '⏳',
    text: '공연 10분 지연 · 19:40 시작',
    isCorrected: false,
  },
];

function App() {
  useEffect(() => {
    async function enterFullscreen() {
      try {
        await document.documentElement.requestFullscreen();
        await screen.orientation?.lock?.('landscape').catch(() => {});
      } catch (e) {
      }
    }
    window.addEventListener('pointerup', enterFullscreen, { once: true });
    return () => window.removeEventListener('pointerup', enterFullscreen);
  }, []);
  const [language, setLanguage] = useState('ko');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [subtitleByLang] = useState(DEFAULT_SUBTITLE);

  if (isHistoryOpen) {
    return (
      <NoticeHistory notices={MOCK_PAST_NOTICES} onClose={() => setIsHistoryOpen(false)} />
    );
  }

  return (
    <main className={styles.screen}>
      <header className={styles.topBar}>
        <LanguageSelect
          language={language}
          onChangeLanguage={setLanguage}
        />
        <NoticeButton onClick={() => setIsHistoryOpen(true)} />
      </header>

      <section className={styles.subtitleArea}>
        <p className={styles.subtitleText}>
          {subtitleByLang[language] || subtitleByLang.ko}
        </p>
      </section>
    </main>
  );
}

export default App;