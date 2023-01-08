import { setTokenCookie } from "../../lib/cookies";
import { magicServer } from "../../lib/magic-server";
import { getUserIdFromToken } from "../../lib/utils";

export default async function logout(req, res) {
    if (req.method === "POST") {
        try {
            const token = req.cookies?.token || null;

            const userId = getUserIdFromToken(token);
            if(!userId) {
                res.send({message: 'Invalid user'});
                return;    
            }
            await magicServer.users.logoutByIssuer(userId);
            setTokenCookie("", res);

            res.send({message: 'User logged out successfully'});
        } catch (e) {
            console.error(e);
            res.status(400).send({ message: `Could not logout user!` });
        }
    } else {
        res.status(400).send({ message: `Invalid ${req.method} - method called. Allowed methods are [POST].` });
    }
}