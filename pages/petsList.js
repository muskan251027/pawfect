import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import profilestyles from '@/styles/Profile.module.css';
import styles from '@/styles/PetsList.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/router';
import QuickLinks from '@/components/QuickLinks';
import { links } from '@/components/utils/constants';
import { faEnvelope, faHandPointDown, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { decimalValidationAndConversion, numberValidation, emailValidation, emptySelectValidation, stringValidation, rootUrl } from '@/components/utils/constants';

const PetsList = () => {

  const router = useRouter();
  const [navlinks, setNavLinks] = useState([]);
  const [petsList, setPetsList] = useState([]);

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
  
      async function fetchPets() {
        const formData = {
          userId: JSON.parse(localStorage.getItem('owner')).ownerId
        };
    
        const formDataToSend = new FormData();
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }
  
        try {
          const response = await fetch(`${rootUrl}petsList.php`, {
            method: 'POST',
            body: formDataToSend,
          });
          const data = await response.json();
          setPetsList(data.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
  
      }
  
      fetchPets();
    }

  }, []);

  const openProfile = (obj) => {
    localStorage.setItem('pet', JSON.stringify(obj));
    router.push('/petProfile');
  };

  return (
    <div className={`main ${profilestyles.profileWrapper}`}>
      <div className={profilestyles.pageHeadingContainer}>
        <h1>QUICK LINKS</h1>
        <QuickLinks links={navlinks}></QuickLinks>
      </div>
      <div className={profilestyles.formContainer}>
        <ul className={styles.petList}>
          {petsList.map((obj, index) => (
            <li key={index} onClick={() => openProfile(obj)}>
              <div className={styles.imgCont}>
                  <Image
                      fill
                      src={obj.petImgType ? `data:${obj.petImgType};base64,${obj.petImg}`: '/images/paw.png'}
                      alt="Pet default Image"
                      className={styles.logoImg}
                  />
              </div>
              <div className={styles.petName}>{obj.petName}</div>
            </li>
          ))}
            
        </ul>
      </div>
    </div>
  );
};

export default PetsList;