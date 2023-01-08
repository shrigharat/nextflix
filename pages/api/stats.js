import jwt from "jsonwebtoken";
import { createShowStats, findShowStatForUser, updateShowStats } from "../../lib/gQueries";
import { getUserIdFromToken } from "../../lib/utils";

export default async function (req, res) {
    if (req.method === "POST") {
        try {
            const token = req.cookies.token;
            if (!token) {
                res.status(403).send({ message: "Unauthorized to complete the request", success: false })
            } else {
                const videoId = req.body.videoId;
                const watched = req.body.watched || false;
                const saved = req.body.saved || false;
                const userId = getUserIdFromToken(token);
                const statsForShow = await findShowStatForUser(userId, videoId, token);
                let stats = {};
                if (statsForShow) {
                    //stats exist, update them
                    stats = await updateShowStats(userId, videoId, watched, saved, token);
                } else {
                    //stats don't exist create them
                    stats = await createShowStats(userId, videoId, watched, saved, token);
                }

                res.send({ success: true, message: "Authorized user", stats });
            }
        } catch (e) {
            res.status(500).send({ message: "Could not update show stats", success: false });
        }
    } else if (req.method === "GET") {
        try {
            const token = req.cookies.token;
            if (!token) {
                res.status(403).send({ message: "Unauthorized to complete the request", success: false })
            } else {
                const videoId = req.query.videoId;
                const userId = getUserIdFromToken(token);
                const statsForShow = await findShowStatForUser(userId, videoId, token);
                if (statsForShow) {
                    res.send({ success: true, stats: statsForShow });
                } else {
                    res.status(404).send({ success: false, message: "Could not find stats for show!", stats: null })
                }
            }
        } catch (e) {
            console.error('Could not get stats');
            res.status(403).send({ message: "Could not get stats for specified video" });
        }
    } else {
        res.status(400).send({ message: `Invalid ${req.method} method invoked. Allowed methods are - [POST]` });
    }
}