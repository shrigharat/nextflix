import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./banner.module.css";

const Banner = ({
  title,
  subTitle,
  imgURL,
  metaData,
  width = "100vw",
  height = "calc(100vh - 4rem)",
  showId
}) => {

  const router = useRouter();
  const handleBannerClick = () => {
    router.push('/show/'+showId);
  }
  
  return (
    <div className={styles.bannerWrapper} style={{ width, height }}>
      <div className={styles.imageWrapper}>
        <img src={imgURL} />
      </div>
      <div className={styles.overlay}></div>
      <div className={styles.bannerContent}>
        <h1>{title}</h1>
        <p>{subTitle}</p>
        {printMetaData(metaData)}
        <button className="flex justify-center items-center gap-1 rounded" onClick={handleBannerClick}><span>Watch now</span> <span className="text-xl bx bx-play"></span></button>
      </div>
    </div>
  );
};

function printMetaData(metaData) {
  if (!metaData) return "";
  return (
    <div>
      <span className="text-sm">{metaData.releaseYear || ""}</span>
      {metaData.releaseYear && metaData.rating && (
        <>
          <span className="text-xs ml-2 mr-2">|</span>{" "}
          <span className="text-sm border px-1">{metaData.rating}</span>
        </>
      )}
      {metaData.rating && metaData.seasonsCount && (
        <>
          <span className="text-xs ml-2 mr-2">|</span>{" "}
          <span className="text-sm">{metaData.seasonsCount} seasons</span>{" "}
        </>
      )}
      {metaData.seasonsCount && metaData.genre && (
        <>
          <span className="text-xs ml-2 mr-2">|</span>{" "}
          <span className="text-sm">{metaData.genre}</span>{" "}
        </>
      )}
    </div>
  );
}

export default Banner;
