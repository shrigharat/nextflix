import Head from "next/head";
import CardGrid from "../components/card-grid/card-grid";
import Header from "../components/header/header";
import { getUserIdFromToken } from "../lib/utils";
import { getWatchListVideos } from "../lib/videos";
import styles from "../styles/MyList.module.css";

export async function getServerSideProps(context) {
    const token = context.req?.cookies?.token || null;
    const userId = getUserIdFromToken(token);

    if (!userId) {
        return {
            props: {},
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }

    const savedVideos = await getWatchListVideos(userId, token);
    return {
        props: {
            savedVideos
        }
    }
}

const MyListPage = ({ savedVideos = [] }) => {
    return <div className={styles.myListPage}>
        <Header />
        <Head>
            <title>My list</title>
        </Head>
        <div className={styles.listPageWrapper}>
            <h1>Your watch list</h1>
            <CardGrid dataList={savedVideos} />
        </div>
    </div>;;
}

export default MyListPage;