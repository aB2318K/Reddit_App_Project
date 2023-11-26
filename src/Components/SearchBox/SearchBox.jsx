import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBox.module.css';

function SearchBox() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    navigate(`/search/?q=${searchQuery}&type=link`);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleSearch} className={styles.button}>
        Search
      </button>
    </div>
  );
}

export default SearchBox;