import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import SearchBox from '../SearchBox/SearchBox';
import Filter from '../Filter/Filter';

function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.headerLink}>
        <h1 className={styles.h1}>DeDDit</h1>
      </Link>
      
      <div className={styles.filter}><Filter /></div>
      
      <div className={styles.searchBox}>
        <SearchBox />
      </div>
    </header>
  );
}

export default Header;