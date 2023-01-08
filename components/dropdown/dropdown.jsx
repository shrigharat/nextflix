import { useState } from "react";
import styles from "./dropdown.module.css";

const Dropdown = ({ displayText, options, handleClick }) => {
  const [open, setOpen] = useState(false);

  const toggleVisibility = () => {
    setOpen(prev => !prev);
  }

  return (
    <div className={styles.dropdown}>
      <div className={styles.selectedOption} onClick={toggleVisibility}>
        <div className={styles.content}>{displayText}</div>
        <div className={styles.icon}><i className='bx bx-menu'></i></div>
        <span>
          <i className="bx bx-chevron-down"></i>
        </span>
      </div>
      <ul className={`${styles.menu} ${open ? styles.open : ''}`}>
        {options.map((opt, index) => (
          <li className={styles.menuItem} onClick={() => handleClick(opt)} key={index}>
            <span>
              <i className={opt.icon}></i>
            </span>
            <span>{opt.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
