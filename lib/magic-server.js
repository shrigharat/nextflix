
const { Magic } = require('@magic-sdk/admin');

export const magicServer = new Magic(process.env.MAGIC_SERVER_SECRET);
