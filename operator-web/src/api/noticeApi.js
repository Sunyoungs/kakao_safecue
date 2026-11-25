const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK = !BASE_URL;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const MOCK_TEMPLATES = [
  {
    id: 'fire',
    label: '화재',
    tone: 'danger',
    detectedAt: '19:48:05',
    body: '화재가 발생했습니다. 직원 안내에 따라 가까운 비상구로 침착하게 대피해 주세요.',
    source: '"불이 났습니다 관객 여러분 비상구로…"',
    timer: null,
    preview: {
      ko: '화재가 발생했습니다\n가까운 비상구로\n침착하게 대피해 주세요',
      en: 'A fire has broken out.\nPlease evacuate calmly\nthrough the nearest exit.',
      ja: '火災が発生しました。\n最寄りの非常口へ\n落ち着いて避難してください。',
      zh: '发生火灾。\n请沿最近的紧急出口\n冷静撤离。',
    },
  },
  {
    id: 'general',
    label: '일반 안내',
    tone: 'normal',
    detectedAt: '19:48:05',
    body: '15분 휴식 후 2부가 시작됩니다. 20:05까지 객석으로 돌아와 주세요.',
    source: '"잠시 쉬었다가 2부 시작하겠습니다…"',
    timer: '15:00',
    preview: {
      ko: '15분 쉬는 시간\n2부 20:05 시작',
      en: '15-minute break\nAct 2 starts at 20:05',
      ja: '15分休憩\n第2部は20:05開始',
      zh: '休息15分钟\n第二部20:05开始',
    },
  },
];

export async function fetchRecommendedTemplates() {
  if (USE_MOCK) {
    await delay(200);
    return MOCK_TEMPLATES;
  }
  const res = await fetch(`${BASE_URL}/notices/templates`);
  if (!res.ok) throw new Error('추천 템플릿을 불러오지 못했습니다.');
  return res.json();
}

export async function sendNotice(payload) {
  if (USE_MOCK) {
    await delay(400);
    return { ok: true, ...payload };
  }
  const res = await fetch(`${BASE_URL}/notices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('공지 송출에 실패했습니다.');
  return res.json();
}