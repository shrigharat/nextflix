import cookie from "cookie";

const MAX_AGE = 7 * 24 * 60 * 60;

export const setTokenCookie = (token, res) => {
    const tokenCookie = cookie.serialize("token", token, 
        { 
            maxAge: token ? MAX_AGE : -1, 
            expires: token ? new Date(Date.now() + MAX_AGE * 1000) : new Date(Date.now() - MAX_AGE * 1000), 
            secure: process.env.NODE_ENV === "production",
            path: "/" 
        }
    );
    res.setHeader("Set-Cookie", tokenCookie);

    return tokenCookie;
}