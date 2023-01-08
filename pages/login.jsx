import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../components/header/header";
import styles from "../styles/Login.module.css";
import { magicClient } from "../lib/magic-client";
import { Loader } from "../components/loader/loader";

const LoginPage = () => {
    const router = useRouter();
    const [error, setError] = useState(undefined);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const emailRegex = new RegExp('[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+');

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

    const runValidations = () => {
        if (!emailRegex.test(email)) {
            return "Enter a valid email";
        }
        return "";
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async () => {
        const error = runValidations();

        if (!error) {
            setLoading(true);
            setError(undefined);
            try {
                const didToken = await magicClient.auth.loginWithMagicLink({ email });
                if(didToken) {
                    const response = await fetch('/api/login', {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${didToken}`,
                            "Content-Type": "application/json"
                        }
                    })
                    const postLogin = await response.json();
                    if(postLogin.success) {
                        setLoading(false);
                        router.push('/');
                    } else {
                        setLoading(false);
                    }
                }
            } catch (e) {
                setLoading(false);
                console.error('Error authenticating email');
            }
        } else {
            setError(error);
        }
    }

    return <>
        <Head>
            <title>Sign in</title>
        </Head>
        <main className={styles.loginPage}>
            <Header template="basic" />
            <div className={styles.loginContainer}>
                <div className={styles.loginBox}>
                    <span>Sign in</span>
                    <span>
                        <input className={error ? styles.inputError : ""} type="text" placeholder="Enter email" onChange={handleEmailChange} value={email} />
                        {error && <p>{error}</p>}
                    </span>
                    <button onClick={handleSubmit}>{loading ? <Loader /> : "Sign in"}</button>
                </div>
            </div>
        </main>
    </>;
}

export default LoginPage;