import Link from "next/link";
import Card from "../card/card";

import styles from "./card-list.module.css";

const CardList = ({ title, cardSize = "medium", dataList }) => {
  const fallbackImgurl = "/static/images/fallback_image.webp";
  return dataList && dataList.length > 0 ? (
    <section className={styles.cardList}>
      <h2>{title}</h2>
      <div className={styles.scrollableContainer}>
        {
          dataList.map((item, index) => {
            const videoTitle = item.snippet?.title || "";
            const videoKey = item.etag;
            const showId = item.id.videoId;
            const imgURL = `https://i.ytimg.com/vi/${showId}/maxresdefault.jpg` || fallbackImgurl;

            return <Link href={`/show/${showId}`} key={index}>
              <a>
                <Card
                  size={cardSize}
                  imgURL={imgURL}
                  title={videoTitle}
                  key={videoKey}
                />
              </a>
            </Link>
          }
          )
        }
      </div>
    </section>
  ) : null;
};
export default CardList;
