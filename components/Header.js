// import React from 'react';
import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link';
import styles from '@/styles/Header.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/router';
import { faUser} from "@fortawesome/free-solid-svg-icons";


const Header = () => {
  
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const checkLogin = localStorage.getItem('owner');
    if (checkLogin) {
      setIsLogin(true);
    }
  }, []);

  const clickLogo = () => {
    router.push('/');
  };
  const clickSignIn = () => {
    if(isLogin) {
      const isLogout = window.confirm('Are you sure you want to logout?');
      if (isLogout) {
        localStorage.removeItem('owner');
        localStorage.removeItem('pet');
        localStorage.removeItem('sendRequestPet');
        window.location.reload();

        setTimeout(() => {
          router.push('/login'); // Redirect to the login page
        }, 1000);
      }
    }
    else {
      router.push('/login');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer} onClick={clickLogo}>
        <span className={styles.logoName}>PAW<span>FECT</span></span>
        <div className={styles.imgCont}>
          <Image
            fill
            src="/images/pawLogo.png"
            alt="Pawfect Logo"
            className={styles.logoImg}
            priority
          />
        </div>
      </div>
      <div className={styles.signInUp} onClick={clickSignIn}>
        <FontAwesomeIcon
          icon={faUser}
          className={styles.userIcon}
        />
        <span>{isLogin ? <span>Logout</span> : <span>Login</span>}</span>
      </div>
    </header>
  );
};

export default Header;
