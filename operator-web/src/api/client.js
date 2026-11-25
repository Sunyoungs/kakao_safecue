const ORIGIN = import.meta.env.VITE_API_BASE_URL;

export const USE_MOCK = !ORIGIN;
export const API_BASE = `${ORIGIN}/api`;

export class ApiError extends Error {
  constructor(status, code, message, detail = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

export async function request(path, { method = 'GET', body, signal } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiError(0, 'network', '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
  }

  if (!res.ok) {
    let detail = null;
    try {
      detail = (await res.json()).detail;
    } catch {
    }
    const isValidation = Array.isArray(detail);
    throw new ApiError(
      res.status,
      isValidation ? 'validation' : detail?.code ?? 'unknown',
      isValidation ? '입력값을 확인해주세요.' : detail?.message ?? '요청에 실패했습니다.',
      detail,
    );
  }

  if (res.status === 204) return null;
  return res.json();
}