export const INTENT_LABELS = {
  FIRE: '화재',
  POWER_OUT: '정전',
  PAUSE: '일시 중단',
  DELAY: '공연 지연',
  INTERMISSION: '인터미션',
  ETIQUETTE: '관람 예절',
  INFO: '일반 안내',
};

export function fillPlaceholders(text = '', { minutes = '', endTime = '' } = {}) {
  return text.replaceAll('{minutes}', minutes).replaceAll('{end_time}', endTime);
}

function kstClock(date, withSeconds) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type).value;
  return withSeconds
    ? `${get('hour')}:${get('minute')}:${get('second')}`
    : `${get('hour')}:${get('minute')}`;
}

export const formatKst = (iso, withSeconds = false) =>
  iso ? kstClock(new Date(iso), withSeconds) : '-';

export const calcEndTime = (minutes, from = new Date()) =>
  kstClock(new Date(from.getTime() + minutes * 60000), false);

export function formatCountdown(expiresAt, now = Date.now()) {
  const total = Math.max(0, Math.round((new Date(expiresAt).getTime() - now) / 1000));
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export const minutesLeft = (expiresAt, now = Date.now()) =>
  Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 60000));