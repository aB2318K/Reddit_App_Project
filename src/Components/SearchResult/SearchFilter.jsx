import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchFilter.module.css';

function SearchFilter({ searchQuery }) {
  const navigate = useNavigate();

  // State to track the selected filter
  const [selectedFilter, setSelectedFilter] = useState('link');

  // Handle filter
  const handleFilter = (type) => {
    navigate(`/search/?q=${searchQuery}&type=${type}`);
    setSelectedFilter(type);
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => handleFilter('link')}
        className={`${styles.button} ${selectedFilter === 'link' ? styles.selected : ''}`}
        disabled={selectedFilter === 'link'}
      >
        Posts
      </button>

      <button
        onClick={() => handleFilter('sr')}
        className={`${styles.button} ${selectedFilter === 'sr' ? styles.selected : ''}`}
        disabled={selectedFilter === 'sr'}
      >
        Communities
      </button>
    </div>
  );
}

export default SearchFilter;