import { useEffect, useRef, useState } from 'react';
import micIcon from '../../assets/mic.svg';
import chevronDown from '../../assets/chevron_down.svg';
import checkIcon from '../../assets/check.svg';
import styles from './micSelect.module.css';

function MicSelect({ devices, deviceId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasLabels = devices.some((d) => d.label);
  const current = devices.find((d) => d.deviceId === deviceId);
  const currentLabel = current?.label || '기본 입력 장치';

  function handleSelect(id) {
    onSelect(id);
    setIsOpen(false);
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={styles.left}>
          <img src={micIcon} alt="" className={styles.icon} />
          <span className={styles.label}>{currentLabel}</span>
        </span>
        <img
          src={chevronDown}
          alt=""
          className={`${styles.icon} ${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <p className={styles.caption}>입력 마이크 장치 선택</p>
          {hasLabels ? (
            <ul className={styles.list}>
              {devices.map((d) => {
                const selected = d.deviceId === deviceId;
                return (
                  <li key={d.deviceId}>
                    <button
                      type="button"
                      className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
                      onClick={() => handleSelect(d.deviceId)}
                    >
                      <span className={styles.optionLabel}>{d.label}</span>
                      {selected && <img src={checkIcon} alt="" className={styles.check} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.hint}>
              수음을 켜고 마이크 권한을 허용하면 장치 목록이 표시돼요.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default MicSelect;