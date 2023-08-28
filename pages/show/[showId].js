import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/header/header";
import { magicClient } from "../../lib/magic-client";
import { getVideoDetailsById, processVideoDetails } from "../../lib/videos";
import styles from "../../styles/Show.module.css";

export async function getStaticPaths() {
    const showList = ["sBEvEcpnG7k", "WWWDskI46Js", "BUjXzrgntcY"];
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

export async function getStaticProps({ params }) {
    const { showId } = params;
    const showDetails = await getVideoDetailsById(showId);
    const processedDetails = processVideoDetails(showDetails);

    return {
        props: {
            showDetails: processedDetails || ""
        },
        revalidate: 10
    }
}

const ShowPage = ({ showDetails }) => {
    const router = useRouter();
    const [isLoggedIn, setLoggedIn] = useState(false);
    const { showId } = router.query;
    const [saved, setSaved] = useState(false);

    //check logged in status 
    useEffect(() => {
        const checkUserState = async () => {
            const loggedIn = await magicClient.user.isLoggedIn();
            setLoggedIn(loggedIn);
        };
        checkUserState();
    }, []);

    //handler for stats api
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

        if (isLoggedIn) {
            createStats();
        }
    }, [isLoggedIn]);

    const handleSaveToWatchlist = async () => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
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

    const { title = "Netflix", description = "", publishTime, channelTitle, viewCount } = showDetails;

    return <div className={styles.showPage}>
        <Header />
        <Head>
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description.substr(0, 16) + "..."} />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description.substr(0, 16) + "..."} />
            <meta property="og:image" content={`https://i.ytimg.com/vi/${showId}/mqdefault.jpg`} />

            <meta property="twitter:card" content={title} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description.substr(0, 16) + "..."} />
            <meta property="twitter:image" content={`https://i.ytimg.com/vi/${showId}/mqdefault.jpg`} />
        </Head>

        <div className={styles.showPageWrapper}>
            {
                showDetails ? <>
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
                            <button
                                style={{
                                    backgroundColor: saved ? "var(--white20)" : "",
                                    color: saved ? "var(--black10)" : "var(--white30"
                                }}
                                onClick={handleSaveToWatchlist}
                            >
                                {!isLoggedIn ? "Login to save" : saved ? (<span>Saved to watchlist<i className='bx bx-check'></i></span>) : "Save to watchlist"}
                            </button>
                        </div>
                    </div>
                </> : <div className={styles.notFound}>
                    <h1>Could not find the show!</h1>
                    <p>Please try again later</p>
                </div>
            }
        </div>
    </div>;
}

export default ShowPage;
