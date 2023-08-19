import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/PetProfile.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/router';
import QuickLinks from '@/components/QuickLinks';
import { petlinks } from '@/components/utils/constants';
import { faEnvelope, faLocationDot, faNotesMedical, faPaw, faPhone, faScaleBalanced, faSyringe, faTransgender } from '@fortawesome/free-solid-svg-icons';

const PetProfile = () => {

  const router = useRouter();
  const [navlinks, setNavLinks] = useState([]);
  const [petDetails, setPetDetails] = useState({});

  useEffect(() => {
    const checkLogin = localStorage.getItem('owner');
    if (!checkLogin) {
      router.push('/login');
    }
    else {
      const linklist = [];
      for (let i = 0; i < petlinks.length; i++) {
        linklist[i] = petlinks[i];
        linklist[i]['onclick'] = ()=>{router.push(linklist[i]['path'])};
      }
      setNavLinks(linklist);
      const getPetDets = localStorage.getItem('pet');
      setPetDetails(JSON.parse(getPetDets));
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
                    src={petDetails.petImgType ? `data:${petDetails.petImgType};base64,${petDetails.petImg}`: '/images/paw.png'}
                    alt="Dog default alt Image"
                    className={styles.logoImg}
                    priority
                />
            </div>
            <div className={styles.about}>
                <h1>{petDetails.petName}</h1>
            </div>
            {/* <div className={styles.status}>Remove Connection</div> */}
        </div>
        <div className={styles.personalInfo}>
            <h1>Personal Information</h1>
            <div><FontAwesomeIcon icon={faPaw} /> <span className={styles.heading}>Species -</span> <span>{petDetails.species}</span></div>
            <div><FontAwesomeIcon icon={faPaw} /> <span className={styles.heading}>Breed -</span> <span>{petDetails.breed}</span></div>
            <div><FontAwesomeIcon icon={faPaw} /> <span className={styles.heading}>Age -</span> <span>{petDetails.age}</span></div>
            <div><FontAwesomeIcon icon={faTransgender} /> <span className={styles.heading}>Gender -</span> <span>{petDetails.gender}</span></div>
            <div><FontAwesomeIcon icon={faPaw} /> <span className={styles.heading}>Size -</span> <span>{petDetails.size}</span></div>
            <div><FontAwesomeIcon icon={faScaleBalanced} /> <span className={styles.heading}>Weight -</span> <span>{petDetails.weight} kg</span></div>
        </div>
        <div className={styles.personalInfo}>
            <h1>More Information</h1>
            <div><FontAwesomeIcon icon={faPaw} /> <span className={styles.heading}>Personality Traits -</span> <span>{petDetails.traits}</span></div>
            <div><FontAwesomeIcon icon={faNotesMedical} /> <span className={styles.heading}>Health Details -</span> <span>{petDetails.health}</span></div>
            <div><FontAwesomeIcon icon={faSyringe} /> <span className={styles.heading}>Vaccination Details -</span> <span>{petDetails.vaccine}</span></div>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;