import { getSavedVideos, getWatchedVideos } from "./gQueries";

export const getVideos = async (api) => {
    const KEY = process.env.YT_API_KEY;
    const baseURL = `https://youtube.googleapis.com/youtube/v3`;
    const params = `maxResults=25&key=${KEY}`;
    const url = `${baseURL}/${api}&${params}`;
    let data = {items: []};
    
    try{
        const result = await fetch(url);
        data = await result.json();
        if(data?.error) {
            data = {items: []};
        }
    } catch(e) {
        data = {items: []}
    }
    
    return data.items;
}

export const getVideosByKeyWord = (keyword) => {
    const api = `search?part=snippet&q=${keyword}`;
    return getVideos(api);
}

export const getPopularVideos = () => {
    const api = "videos?chart=mostPopular";
    return getVideos(api);
}

export const getVideoDetailsById = (id) => {
    const api = `videos?part=snippet%2Cstatistics&id=${id}`;
    return getVideos(api);
}

export const processVideoDetails = (video) => {
    const processedVideo = {};

    if(!video || !video[0]) {
        return undefined;
    }

    if(video[0].snippet) {
        processedVideo.title = video[0].snippet.title;
        processedVideo.description = video[0].snippet.description;
        processedVideo.publishTime = video[0].snippet.publishedAt ? video[0].snippet.publishedAt.split('T')[0] : "-- --";
        processedVideo.channelTitle = video[0].snippet.channelTitle;
    }

    if(video[0].statistics) {
        processedVideo.viewCount = video[0].statistics.viewCount;
    }
    
    return processedVideo;
}

export const getWatchItAgainVideos = async (userId, token) => {
    const videos = await getWatchedVideos(userId, token);
    return videos.map(video => {
        return {
            id: {
                videoId: video.videoId
            },
            imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
        }
    });
}

export const getWatchListVideos = async (userId, token) => {
    const videos = await getSavedVideos(userId, token);
    return videos.map(video => {
        return {
            id: {
                videoId: video.videoId
            },
            imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
        }
    });
}