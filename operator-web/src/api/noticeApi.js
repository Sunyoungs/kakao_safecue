import { ApiError, USE_MOCK, request } from './client';
import { calcEndTime, fillPlaceholders } from '../utils/notice';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const MOCK_TEMPLATES = [
  {
    code: 'FIRE',
    intent_type: 'FIRE',
    title: '화재 대피 안내',
    text_ko: '화재가 발생했습니다. 직원 안내에 따라 가까운 비상구로 침착하게 대피해 주세요.',
    text_easy: '불이 났어요\n비상구로 대피하세요',
    text_en: 'A fire has broken out.\nPlease evacuate through the nearest exit.',
    text_zh: '发生火灾。\n请从最近的紧急出口撤离。',
    text_ja: '火災が発生しました。\n最寄りの非常口へ避難してください。',
    pictogram: 'fire',
    widget: 'map',
    default_minutes: null,
    trigger_haptic: true,
    is_default: true,
    is_active: true,
    sort_order: 10,
  },
  {
    code: 'INTERMISSION',
    intent_type: 'INTERMISSION',
    title: '인터미션 안내',
    text_ko: '지금부터 {minutes}분간 휴식입니다. 2부는 {end_time}에 시작합니다.',
    text_easy: '{minutes}분 휴식 · 2부 {end_time} 시작',
    text_en: '{minutes}-min break · Act 2 starts {end_time}',
    text_zh: '休息{minutes}分钟 · 第二幕 {end_time} 开始',
    text_ja: '{minutes}分休憩 · 第2部 {end_time} 開始',
    pictogram: 'clock',
    widget: 'timer',
    default_minutes: 15,
    trigger_haptic: false,
    is_default: false,
    is_active: true,
    sort_order: 50,
  },
];

let mockSeq = 100;
let mockActive = null;

export async function fetchTemplates() {
  if (USE_MOCK) {
    await delay(150);
    return MOCK_TEMPLATES;
  }
  const data = await request('/templates');
  return Array.isArray(data) ? data : data.templates ?? [];
}

export async function sendNotice(payload) {
  if (USE_MOCK) {
    await delay(300);
    if (mockActive?.intent_type === 'FIRE') {
      throw new ApiError(
        409,
        'fire_active',
        '화재 대피 안내가 송출 중입니다. [종료] 후에 보낼 수 있습니다.',
      );
    }
    const tpl = MOCK_TEMPLATES.find((t) => t.code === payload.template_code);
    if (!tpl) throw new ApiError(404, 'not_found', '템플릿을 찾을 수 없습니다.');

    const now = new Date();
    const minutes = payload.minutes ?? tpl.default_minutes ?? null;
    const endTime = minutes ? calcEndTime(minutes, now) : '';
    const fill = (s) => fillPlaceholders(s, { minutes: minutes ?? '', endTime });

    mockSeq += 1;
    mockActive = {
      id: mockSeq,
      template_code: tpl.code,
      intent_type: tpl.intent_type,
      title: null,
      text_ko: fill(tpl.text_ko),
      text_easy: fill(tpl.text_easy),
      text_en: fill(tpl.text_en),
      text_zh: fill(tpl.text_zh),
      text_ja: fill(tpl.text_ja),
      pictogram: tpl.pictogram,
      widget: tpl.widget,
      minutes,
      expires_at: minutes ? new Date(now.getTime() + minutes * 60000).toISOString() : null,
      direction: null,
      trigger_haptic: tpl.trigger_haptic,
      operator_name: null,
      status: 'ACTIVE',
      revision: 0,
      created_at: now.toISOString(),
      ended_at: null,
    };
    return mockActive;
  }
  return request('/notices', { method: 'POST', body: payload });
}

export async function updateNotice(noticeId, payload) {
  if (USE_MOCK) {
    await delay(300);
    mockActive = { ...mockActive, ...payload, revision: (mockActive?.revision ?? 0) + 1 };
    return mockActive;
  }
  return request(`/notices/${noticeId}`, { method: 'PATCH', body: payload });
}

export async function endNotice(noticeId) {
  if (USE_MOCK) {
    await delay(200);
    const ended = { ...mockActive, status: 'ENDED', ended_at: new Date().toISOString() };
    mockActive = null;
    return ended;
  }
  return request(`/notices/${noticeId}/end`, { method: 'POST' });
}

export async function fetchActiveNotice() {
  if (USE_MOCK) {
    await delay(100);
    return mockActive;
  }
  try {
    const data = await request('/notices/active');
    return data && data.id ? data : null;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}