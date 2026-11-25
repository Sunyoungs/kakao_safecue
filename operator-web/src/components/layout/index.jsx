import logo from '../../assets/logo.svg';
import menuHome from '../../assets/left_home.svg';
import menuList from '../../assets/left_list.svg';
import menuCreate from '../../assets/left_add.svg';
import menuPlay from '../../assets/left_start.svg';
import menuApprove from '../../assets/left_check.svg';
import styles from './layout.module.css';

const MENUS = [
  { key: 'home', label: '메인화면', icon: menuHome },
  { key: 'list', label: '공연 목록', icon: menuList },
  { key: 'create', label: '공연 개설하기', icon: menuCreate },
  { key: 'play', label: '공연 송출하기', icon: menuPlay },
  { key: 'approve', label: '공연 디바이스 승인', icon: menuApprove },
];

function Layout({ title, date, activeMenu = 'play', headerRight, banner, children }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <img src={logo} alt="OROT" className={styles.logo} />
        <ul className={styles.menu}>
          {MENUS.map((menu) => (
            <li
              key={menu.key}
              className={`${styles.menuItem} ${menu.key === activeMenu ? styles.menuItemActive : ''}`}
            >
              <img src={menu.icon} alt="" className={styles.menuIcon} />
              <span>{menu.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {title} <span className={styles.date}>· {date}</span>
          </h1>
          {headerRight}
        </header>

        <div className={styles.body}>
          {children}
          {banner && <div className={styles.banner}>{banner}</div>}
        </div>
      </div>
    </div>
  );
}

export default Layout;