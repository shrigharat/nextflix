import Link from "next/link";
import Card from "../card/card";
import styles from "./card-grid.module.css";

const CardGrid = ({ dataList, title }) => {
    return <div className={styles.gridWrapper}>
        {title &&
            <h2>{title}</h2>
        }
        <div className={styles.grid}>
            {
                dataList.map((item, index) => {
                    const videoTitle = item.snippet?.title || "";
                    const videoKey = item.etag;
                    const showId = item.id.videoId;
                    const imgURL = `https://i.ytimg.com/vi/${showId}/maxresdefault.jpg` || fallbackImgurl;

                    return <Link href={`/show/${showId}`} key={index}>
                        <a>
                            <Card
                                size="small"
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
    </div>
}

export default CardGrid;
