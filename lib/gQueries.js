async function queryGql(operationSchema, operationName, variables, method = "GET", token) {
    const result = await fetch(
        process.env.HASURA_API_URL,
        {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: operationSchema,
                variables: variables,
                operationName: operationName
            })
        }
    );

    return await result.json();
}


//accounts
export async function checkAccountExists(issuer, token) {
    const checkAccountExistsSchema = `
        query UserExists($issuer: String!) {
            accounts(where: {issuer: {_eq: $issuer}}) {
            email
            id
            issuer
            publicAddress
        }
    }`;

    const response = await queryGql(
        checkAccountExistsSchema,
        "UserExists",
        { issuer },
        "POST",
        token
    );

    if (response.data?.accounts?.length > 0) {
        return { userExists: true, user: response.data?.accounts[0] };
    } else {
        return { userExists: false };
    }
}

export async function createNewAccount(issuer, email, publicAddress, token) {
    const createAccountSchema = `
        mutation CreateAccount($email: String!, $issuer: String!, $publicAddress: String!) {
            insert_accounts(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
            returning {
                email
                id
                issuer
                publicAddress
            }
            }
        }
    `;

    const response = await queryGql(
        createAccountSchema,
        "CreateAccount",
        { email, issuer, publicAddress },
        "POST",
        token
    );

    return response.data?.insert_accounts?.returning[0];
}


//stats
export async function updateShowStats(userId, videoId, watched, saved, token) {
    const updateShowStatsSchema = `
        mutation UpdateShowStatsMutation($watched: Boolean!, $saved: Boolean!, $userId: String!, $videoId: String!) {
            update_stats(_set: {watched: $watched, saved: $saved}, where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
                returning {
                    id
                    saved
                    userId
                    videoId
                    watched
                }
            }
        }
    `;
    const response = await queryGql(
        updateShowStatsSchema,
        "UpdateShowStatsMutation",
        { userId, videoId, watched, saved },
        "POST",
        token
    );
    
    return response.data?.update_stats?.returning[0];
};

export async function createShowStats(userId, videoId, watched, saved, token) {
    const createShowStatsSchema = `
        mutation CreateStatsMutation($userId: String!, $videoId: String!, $watched: Boolean!, $saved: Boolean!) {
            insert_stats(objects: {userId: $userId, videoId: $videoId, watched: $watched, saved: $saved}) {
            returning {
                id
                saved
                userId
                videoId
                watched
            }
        }
      }
    `;
    const response = await queryGql(
        createShowStatsSchema,
        "CreateStatsMutation",
        { userId, videoId, watched, saved },
        "POST",
        token
    );
    
    return response.data?.insert_stats?.returning[0];
};

export async function findShowStatForUser(userId, videoId, token) {
    const findShowStatSchema = `
        query FindShowStatForUser($userId: String!, $videoId: String!) {
            stats(where: {videoId: {_eq: $videoId}, userId: {_eq: $userId}}) {
                id
                saved
                userId
                videoId
                watched
            }
        }     
    `;
    const response = await queryGql(
        findShowStatSchema,
        "FindShowStatForUser",
        { userId, videoId },
        "POST",
        token
    );

    return response?.data?.stats[0];
}

export async function getWatchedVideos(userId, token) {
    const getWatchedVideosSchema = `
        query GetWatchedVideos($userId: String!) {
            stats(where: {userId: {_eq: $userId}, watched: {_eq: true}}) {
                videoId
            }
        }
    `;

    const response = await queryGql(
        getWatchedVideosSchema,
        "GetWatchedVideos",
        { userId },
        "POST",
        token
    );

    return response?.data?.stats || [];
}

export async function getSavedVideos(userId, token) {
    const getSavedVideosSchema = `
        query GetSavedVideos($userId: String!) {
            stats(where: {userId: {_eq: $userId}, saved: {_eq: true}}) {
                videoId
            }
        }
    `;

    const response = await queryGql(
        getSavedVideosSchema,
        "GetSavedVideos",
        { userId },
        "POST",
        token
    );

    return response?.data?.stats;
}
