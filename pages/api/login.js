import jwt from "jsonwebtoken";

import { magicServer } from "../../lib/magic-server";
import { checkAccountExists, createNewAccount } from "../../lib/gQueries";
import { setTokenCookie } from "../../lib/cookies";

export default async function (req, res) {
    if (req.method === "POST") {
        try {
            const auth = req.headers.authorization;
            const didToken = auth ? auth.substr(7) : "";
            const metadata = await magicServer.users.getMetadataByToken(didToken);
            //create the actual hasura acceptable token
            const token = jwt.sign(
                {
                    "iat": Math.floor(Date.now() / 1000),
                    "exp": Math.floor(Date.now() / 1000 + (7 * 24 * 60 * 60)),
                    "https://hasura.io/jwt/claims": {
                        "x-hasura-allowed-roles": ["user", "admin"],
                        "x-hasura-default-role": "user",
                        "x-hasura-user-id": metadata.issuer
                    }
                },
                process.env.JWT_SECRET,
                { algorithm: "HS256" }
            );
            const account = await checkAccountExists(metadata.issuer, token);
            if (account.userExists) {
                //return the existing user
                const cookie = setTokenCookie(token, res);
                res.send({ message: "Login successful", accountExists: account.userExists, account: account.user, success: true });
            } else {
                //create the new user
                const account = await createNewAccount(metadata.issuer, metadata.email, metadata.publicAddress, token);
                const cookie = setTokenCookie(token, res);
                res.send({ message: "User created", accountExists: false, account, success: true });
            }
        } catch (e) {
            console.error('Error logging in', e);
            res.status(400).send({ message: 'Could not login user', success: false });
        }
    } else {
        res.status(400).send({ message: `Invalid ${req.method} method invoked. Allowed methods are - [POST]` })
    }
}