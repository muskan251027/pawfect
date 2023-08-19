import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Profile.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/router';
import QuickLinks from '@/components/QuickLinks';
import { links, rootUrl } from '@/components/utils/constants';
import { faEnvelope, faHandPointDown, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {

  const router = useRouter();
  const [navlinks, setNavLinks] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState({});
  const [locationName, setLocationName] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const checkLogin = localStorage.getItem('owner');
    if (!checkLogin) {
      router.push('/login');
    }
    else {
      const linklist = [];
      for (let i = 0; i < links.length; i++) {
        linklist[i] = links[i];
        linklist[i]['onclick'] = ()=>{router.push(linklist[i]['path'])};
      }
      setNavLinks(linklist);
      const ownerDets = JSON.parse(checkLogin);
      setOwnerDetails(ownerDets);
    }
  }, []);

  return (
    <div className={`main ${styles.profileWrapper}`}>
      <div className={styles.pageHeadingContainer}>
        <h1>QUICK LINKS</h1>
        <QuickLinks links={navlinks}></QuickLinks>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.aboutSection}>
            <div className={styles.imgCont}>
                <Image
                    fill
                    src={ownerDetails.ownerImgType ? `data:${ownerDetails.ownerImgType};base64,${ownerDetails.ownerImg}`: '/images/owner.png'}
                    alt="Owner alt Image"
                    className={styles.logoImg}
                />
            </div>
            <div className={styles.about}>
                <h1>{ownerDetails.fName} {ownerDetails.lName}</h1>
                <p>{ownerDetails.about ? ownerDetails.about : ''}</p>
            </div>
        </div>
        <div className={styles.personalInfo}>
            <h1>Personal Information</h1>
            <div><FontAwesomeIcon icon={faEnvelope} /> <span>{ownerDetails.email}</span></div>
            <div><FontAwesomeIcon icon={faPhone} /> <span>{ownerDetails.contact}</span></div>
            <div><FontAwesomeIcon icon={faLocationDot} /> <span>{ownerDetails.locationName}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;