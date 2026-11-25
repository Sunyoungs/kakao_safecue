import { useCallback, useEffect, useState } from 'react';
import { pingServer } from '../api/serverApi';

export default function useServerStatus(intervalMs = 5000) {
  const [status, setStatus] = useState('checking');

  const check = useCallback(async () => {
    const ok = await pingServer();
    setStatus(ok ? 'connected' : 'disconnected');
  }, []);

  useEffect(() => {
    check();
    const id = setInterval(check, intervalMs);
    window.addEventListener('online', check);
    window.addEventListener('offline', check);
    return () => {
      clearInterval(id);
      window.removeEventListener('online', check);
      window.removeEventListener('offline', check);
    };
  }, [check, intervalMs]);

  return { status, retry: check };
}