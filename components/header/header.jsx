import Link from "next/link";
import { useEffect, useState } from "react";
import Dropdown from "../dropdown/dropdown";
import { magicClient } from "../../lib/magic-client";


import styles from "./header.module.css";
import { useRouter } from "next/router";

const Header = ({ template = "" }) => {
  const [user, setUser] = useState(false);
  const router = useRouter();

  const options = [
    { name: "Profile", key: "profile", icon: "bx bx-user" },
    { name: "Watchlist", key: "my-list", icon: "bx bx-list-ul"},
    { name: "Sign out", key: "signOut", icon: "bx bx-log-out" },
  ];

  const handleOptionClick = async (option) => {
    if (option.key == "signOut") {
      try {
        await fetch('/api/logout', {
          method: "POST"
        });
        const loggedIn = await magicClient.user.isLoggedIn();

        if(!loggedIn) {
          router.push('/login');
        }
      } catch(e) {
        console.error('Could not log you out!');
      }
    } else if(option.key == "my-list") {
        router.push('/my-list');
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try{
        const { email } = await magicClient.user.getMetadata();
        setUser(email);
      } catch(e) {
        console.error('Could not get current user!');
      }
    };
    getUser();
  }, []);

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <ul style={{ justifyContent: template === "basic" ? "center" : "space-between" }}>
          <li className="text-4xl font-bebas font-black text-red-10 relative top-1 cursor-pointer" onClick={() => router.push('/')}>
            NEXTFLIX
          </li>
          {
            template === "basic" ? "" : !user ? <div className={styles.actions}>
              <li className="text-xs font-inter bg-red-10 py-2 px-6 rounded-sm">
                <Link href="/join">
                  <a href="">JOIN NOW</a>
                </Link>
              </li>
              <li className="text-xs font-inter border-gray-20 border py-2 px-6 rounded-sm hover:bg-gray-30">
                <Link href="/login">
                  <a href="">SIGN IN</a>
                </Link>
              </li>
            </div> : (
              <Dropdown
                displayText={user}
                options={options}
                handleClick={handleOptionClick}
              />
            )
          }
        </ul>
      </nav>
    </header>
  );
};

export default Header;
