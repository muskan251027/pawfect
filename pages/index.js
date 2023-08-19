import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/router';
import { faForward } from "@fortawesome/free-solid-svg-icons";

const Home = () => {

  const router = useRouter();

  const clickForward = () => {
    const checkLogin = localStorage.getItem('owner');
    if (checkLogin) {
      router.push('/profile');
    }
    else {
      router.push('/register');
    }
  };

  return (
    <div className={`main ${styles.homeWrapper}`}>
      <div className={`${styles.imgCont} ${styles.imgCont1}`}>
        <Image
          fill
          src="/images/dog1.png"
          alt="Dog home Image"
          className={styles.logoImg}
          priority
        />
      </div>
      <div className={styles.homeContent}>
        <div className={styles.homeMainLine}>
          Purrfect Playdates for <span>Pawfect Pals!</span>
        </div>
        <div className={styles.homeMainContent}>
          Connecting furry friends for fun and play.<br></br>Join our vibrant community of pet lovers and schedule playdates for your adorable companions. Whether it's dogs chasing each other at the park or cats frolicking indoors, our platform is the purrfect place to find playmates for your pets.
        </div>
        <div className={styles.homeJoinLine}>Join our Playdate Paradise now and let the fur-filled fun begin! </div>
        <div className={styles.arrow} onClick={clickForward}>
          <FontAwesomeIcon
            icon={faForward}
            className={styles.forwardIcon}
          />
        </div>
      </div>
      <div className={`${styles.imgCont} ${styles.imgCont2}`}>
        <Image
          fill
          src="/images/cat1.png"
          alt="Cat home Image"
          className={styles.logoImg}
          priority
        />
      </div>
    </div>
  );
};

export default Home;

//     //   <main className={`${styles.main} ${inter.className}`}>
