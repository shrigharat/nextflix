import { Magic } from 'magic-sdk';

const instantiateMagic = () => {
    return (typeof window !== 'undefined' && new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY));
} 

export const magicClient = instantiateMagic();
