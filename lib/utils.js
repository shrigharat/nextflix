import jwt from "jsonwebtoken";

export function getUserIdFromToken(token) {
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded['https://hasura.io/jwt/claims']['x-hasura-user-id'];
    return userId;
}