import React, { useState } from 'react';
import styles from './Filter.module.css';
import { useNavigate } from 'react-router-dom';

const Filter = () => {
  const [selectedOption, setSelectedOption] = useState('☼ Hot');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    if (option === '❍ New') {
      navigate('/new');
    } else if (option === '🔝Top') {
      navigate('/top');
    } else {
      navigate('/');
    }
  };

  const options = ['☼ Hot', '🔝Top', '❍ New'];

  return (
    <div className={styles.container}>
      <div
        className={styles.dropdown}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedOption} ▼
        {isDropdownOpen && (
          <div className={styles.options}>
            {options.map((option) => (
              <div
                key={option}
                className={styles.option}
                onClick={() => handleSelectChange(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;