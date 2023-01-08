import Head from "next/head";
import Banner from "../components/banner/banner";
import CardList from "../components/card-list/card-list";
import Header from "../components/header/header";
import styles from "../styles/Home.module.css";
import { getVideosByKeyWord, getWatchItAgainVideos } from "../lib/videos"
import { getUserIdFromToken } from "../lib/utils";

export async function getServerSideProps(context) {
  const token = context.req?.cookies?.token || null;
  const userId = getUserIdFromToken(token);

  const [trailerVideos, popularVideos, travelVideos, upcomingVideos, watchItAgainVideos] = await Promise.all([
    getVideosByKeyWord('hollywood trailers'), 
    getVideosByKeyWord('trending'),
    getVideosByKeyWord('travel'),
    getVideosByKeyWord('netflix trailers'),
    getWatchItAgainVideos(userId, token)
  ]);
  return { props: { dataList: {
    trailerVideos,
    popularVideos,
    travelVideos,
    upcomingVideos,
    watchItAgainVideos
  } } };
}

export default function Home({ dataList }) {
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflix</title>
        <meta name="description" content="Netflix replica by Shrishail" />
        <meta name="title" content="Nextflix" />
        <meta name="description" content="Netflix replica by Shrishail" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Nextflix" />
        <meta property="og:description" content="Netflix replica by Shrishail" />
        <meta property="og:image" content="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png" />

        <meta property="twitter:card" content="Nextflix" />
        <meta property="twitter:title" content="Nextflix" />
        <meta property="twitter:description" content="Netflix replica by Shrishail" />
        <meta property="twitter:image" content="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Header />
        <Banner
          title="Stranger things"
          subTitle="When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl."
          imgURL="/static/images/stranger_things.jpg"
          metaData={{
            releaseYear: 2016,
            genre: "Teen TV Shows",
            rating: "U/A 16+",
            seasonsCount: 4,
          }}
          showId="yQEondeGvKo"
        />
        <CardList title="Hollywood Trailers" cardSize="large" dataList={dataList.trailerVideos} />
        <CardList title="Watch it again" cardSize="small" dataList={dataList.watchItAgainVideos} />
        <CardList title="Popular" cardSize="small" dataList={dataList.popularVideos} />
        <CardList title="Travel" cardSize="medium" dataList={dataList.travelVideos} />
        <CardList title="Upcoming Trailers" cardSize="small" dataList={dataList.upcomingVideos} />
      </main>
    </div>
  );
}
