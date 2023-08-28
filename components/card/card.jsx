import Image from "next/image";
import styles from "./card.module.css";

const Card = ({ size, imgURL, title }) => {
  const configMap = {
    small: styles.smCard,
    medium: styles.mdCard,
    large: styles.lgCard,
  };

  const [imageHref, setImageHref] = useState(imgURL);
  const [imageTries, setImageTries] = useState(0);
  const fallbackImgurl = "/static/images/fallback_image.webp";

  const onError = () => {
    let tries = imageTries;
    tries += 1;
    setImageTries(prev => prev+1);

    if(tries == 1) {
      setImageHref(imgURL.replace('maxresdefault', 'hqdefault'));
    } else if(tries == 2) {
      setImageHref(fallbackImgurl);
    }
  }

  return (
    <div className={`${configMap[size]} ${styles.card}`}>
      {
        title && <div className={styles.overlay}></div>
      }
      <div className={styles.imgWrapper}>
        <Image src={imageHref} layout="fill" onError={onError} />
      </div>
      <div className={styles.content}>
        <span>{title}</span>
      </div>
    </div>
  );
};

export default Card;
