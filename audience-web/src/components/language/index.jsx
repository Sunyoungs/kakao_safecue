import { useEffect, useRef, useState } from 'react';
import languageIcon from '../../assets/language.svg';
import languageCheck from '../../assets/language_check.svg';
import styles from './language.module.css';

const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
];

function LanguageSelect({ language, onChangeLanguage }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const currentLang = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(code) {
    onChangeLanguage(code);
    setIsOpen(false);
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button type="button" className={styles.triggerBtn} onClick={() => setIsOpen((prev) => !prev)}>
        <span>{currentLang.label}</span>
        <img src={languageIcon} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
      </button>

      {isOpen && (
        <ul className={styles.dropdown}>
          {LANGUAGES.map((item) => {
            const isSelected = item.code === language;
            return (
              <li key={item.code}>
                <button type="button" className={`${styles.optionBtn} ${isSelected ? styles.selected : ''}`} onClick={() => handleSelect(item.code)}>
                  <span>{item.label}</span>
                  {isSelected && (
                    <img src={languageCheck} className={styles.checkIcon} />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelect;