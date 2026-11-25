import Button from '../button';
import searchIcon from '../../assets/search.svg';
import styles from './subtitleList.module.css';

function SubtitleList({ items }) {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <span className={styles.headNumber}>번호</span>
        <div className={styles.searchGroup}>
          <input
            className={styles.input}
            placeholder="번호 검색 (ex. 123 또는 ad1)"
          />
          <Button variant="dark" size="md" aria-label="검색" className={styles.searchBtn}>
            <img src={searchIcon} alt="" className={styles.searchIcon} />
          </Button>
        </div>
      </header>

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.row}>
            <span className={styles.number}>{item.id}</span>
            <p className={styles.text}>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SubtitleList;