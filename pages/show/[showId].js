import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/header/header";
import { getUserIdFromToken } from "../../lib/utils";
import { getVideoDetailsById, processVideoDetails } from "../../lib/videos";
import styles from "../../styles/Show.module.css";

export async function getStaticPaths() {
    const showList = ["yQEondeGvKo", "WWWDskI46Js", "BUjXzrgntcY"];
    const paths = showList.map((showId) => {
        return {
            params: { showId }
        }
    });

    return {
        paths,
        fallback: "blocking"
    }
}

export async function getStaticProps({ params, req }) {
    const token = req?.cookies?.token;
    const userId = getUserIdFromToken(token);

    const { showId } = params;
    const showDetails = await getVideoDetailsById(showId);
    const processedDetails = processVideoDetails(showDetails);

    return {
        props: {
            showDetails: processedDetails
        },
        revalidate: 10
    }
}

const ShowPage = ({ showDetails }) => {
    const router = useRouter();
    const { showId } = router.query;
    const [saved, setSaved] = useState(false);

    const handleSaveToWatchlist = async () => {
        const toSave = !saved;
        const response = await fetch('/api/stats', {
            method: "POST",
            body: JSON.stringify({ videoId: showId, watched: true, saved: toSave }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        setSaved(data.stats.saved);
    }

    useEffect(() => {
        const createStats = async () => {
            const showStatsResponse = await fetch(`/api/stats?videoId=${showId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const showStatsData = await showStatsResponse.json();
            if (showStatsData.stats) {
                setSaved(showStatsData.stats.saved);
            } else {
                const response = await fetch('/api/stats', {
                    method: "POST",
                    body: JSON.stringify({ videoId: showId, watched: true, saved }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                setSaved(data.stats.saved);
            }
        }
        createStats();
    }, []);

    const { title, description, publishTime, channelTitle, viewCount } = showDetails;

    return <div className={styles.showPage}>
        <Header />
        <Head>
            <title>{title}</title>
            <meta name="description" content={description.substr(0,16) + "..."} />
        </Head>
        <div className={styles.showPageWrapper}>
            <iframe id="ytplayer"
                type="text/html" width="100%" height="480"
                src={`https://www.youtube.com/embed/${showId}?autoplay=1&origin=http://example.com&controls=0&modestbranding=1`}
                frameBorder="0">
            </iframe>
            <div className={styles.showDetails}>
                <div className={styles.col1}>
                    <h1>{title}</h1>
                    <span>{publishTime}</span>
                    <p>{description}</p>
                </div>
                <div className={styles.col2}>
                    <div>
                        <span>By {channelTitle} <i className='bx bxs-check-circle' style={{ color: '#dc2626' }}></i></span>
                        <br />
                        <span>{viewCount} views</span>
                    </div>
                    <button style={{ backgroundColor: saved ? "var(--white20)" : "", color: saved ? "var(--black10)" : "var(--white30" }} onClick={handleSaveToWatchlist}>{saved ? (<span>Saved to watchlist<i className='bx bx-check'></i></span>) : "Save to watchlist"}</button>
                </div>
            </div>
        </div>
    </div>;
}

export default ShowPage;