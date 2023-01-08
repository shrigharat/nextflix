import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader } from '../components/loader/loader';
import { magicClient } from '../lib/magic-client';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleRedirection = async () => {
      try {
        const activeRoute = router.pathname;
        const isLoggedIn = await magicClient.user.isLoggedIn();

        if (!isLoggedIn) {
          router.push('/login');
        } else if (isLoggedIn && activeRoute === '/login') {
          router.push('/');
        } else {
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
        console.error("Error in redirecting user!", e);
      }
    };
    handleRedirection();
  }, [])

  useEffect(() => {
    const handleComplete = () => {
      setLoading(false);
    }
    
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return loading ? <div className="loaderContainer"><Loader width='48px' height='48px' /></div> : <Component {...pageProps} />
}

export default MyApp
