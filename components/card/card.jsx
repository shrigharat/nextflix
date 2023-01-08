import Image from "next/image";
import styles from "./card.module.css";
import { motion } from "framer-motion";

const Card = ({ size, imgURL, title }) => {
  const configMap = {
    small: styles.smCard,
    medium: styles.mdCard,
    large: styles.lgCard,
  };

  return (
    <div className={`${configMap[size]} ${styles.card}`}>
      {
        title && <div className={styles.overlay}></div>
      }
      <div className={styles.imgWrapper}>
        <Image src={imgURL} layout="fill" />
      </div>
      <div className={styles.content}>
        <span>{title}</span>
      </div>
    </div>
  );
};

export default Card;
