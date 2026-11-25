import { useCallback, useEffect, useRef, useState } from 'react';

export const BAR_COUNT = 10;
const SENSITIVITY = 4; // 막대가 너무 안 오르면 키우고, 너무 잘 오르면 줄이세요

export const MIC_ERROR_MESSAGES = {
  denied: '마이크 권한이 필요해요. 브라우저 설정에서 마이크 접근을 허용해주세요.',
  notfound: '사용 가능한 마이크를 찾을 수 없어요. 장치를 연결한 뒤 다시 시도해주세요.',
  disconnected: '마이크 연결이 끊어졌어요. 장치를 확인한 뒤 다시 시도해주세요.',
  insecure: '이 주소에서는 마이크를 쓸 수 없어요. localhost 또는 https로 접속해주세요.',
  unknown: '마이크를 시작하지 못했어요. 다시 시도해주세요.',
};

function toErrorType(err) {
  switch (err?.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'denied';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'notfound';
    default:
      return 'unknown';
  }
}

export default function useMicrophone() {
  const [status, setStatus] = useState('idle');
  const [errorType, setErrorType] = useState(null);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState('default');
  const [level, setLevel] = useState(0); 

  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(0);
  const lastLevelRef = useRef(0);
  const deviceIdRef = useRef('default');

  const stopStream = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((track) => {
      track.onended = null;
      track.stop();
    });
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    lastLevelRef.current = 0;
    setLevel(0);
  }, []);

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const all = await navigator.mediaDevices.enumerateDevices();
    setDevices(
      all.filter((d) => d.kind === 'audioinput' && d.deviceId !== 'communications'),
    );
  }, []);

  const start = useCallback(
    async (id) => {
      const targetId = typeof id === 'string' ? id : deviceIdRef.current;

      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorType('insecure');
        setStatus('error');
        return false;
      }

      stopStream();
      setErrorType(null);
      setStatus('requesting');

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: targetId === 'default' ? true : { deviceId: { exact: targetId } },
        });
        streamRef.current = stream;

        const track = stream.getAudioTracks()[0];
        track.onended = () => {
          stopStream();
          setErrorType('disconnected');
          setStatus('error');
        };

        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const buf = new Uint8Array(analyser.fftSize);

        const tick = () => {
          analyser.getByteTimeDomainData(buf);
          let sum = 0;
          for (let i = 0; i < buf.length; i += 1) {
            const n = (buf[i] - 128) / 128;
            sum += n * n;
          }
          const rms = Math.sqrt(sum / buf.length);
          const bars = Math.min(BAR_COUNT, Math.round(rms * SENSITIVITY * BAR_COUNT));
          if (bars !== lastLevelRef.current) {
            lastLevelRef.current = bars;
            setLevel(bars);
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();

        deviceIdRef.current = targetId;
        setDeviceId(targetId);
        setStatus('connected');
        await refreshDevices();
        return true;
      } catch (err) {
        stopStream();
        setErrorType(toErrorType(err));
        setStatus('error');
        return false;
      }
    },
    [refreshDevices, stopStream],
  );

  const stop = useCallback(() => {
    stopStream();
    setErrorType(null);
    setStatus('idle');
  }, [stopStream]);

  const selectDevice = useCallback(
    (id) => {
      deviceIdRef.current = id;
      setDeviceId(id);
      if (streamRef.current) start(id); 
    },
    [start],
  );

  useEffect(() => {
    refreshDevices();
    const md = navigator.mediaDevices;
    md?.addEventListener?.('devicechange', refreshDevices);
    return () => {
      md?.removeEventListener?.('devicechange', refreshDevices);
      stopStream();
    };
  }, [refreshDevices, stopStream]);

  return { status, errorType, devices, deviceId, level, start, stop, selectDevice };
}