import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Requests.module.css';
import petprofileStyles from '@/styles/PetProfile.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/router';
import QuickLinks from '@/components/QuickLinks';
import { petlinks } from '@/components/utils/constants';
import { faCheck, faEnvelope, faHandPointDown, faLocationDot, faPaw, faPhone, faXmark } from '@fortawesome/free-solid-svg-icons';
import FormInput from '@/components/FormInput';
import { decimalValidationAndConversion, numberValidation, emailValidation, emptySelectValidation, stringValidation, rootUrl } from '@/components/utils/constants';


const PetConnections = () => {

  const router = useRouter();
  const [navlinks, setNavLinks] = useState([]);
  const [currentPetDetails, setCurrentPetDetails] = useState({}); // reciever
  const [myLikesList, setMyLikesList] = useState([]);
  const [likesBackList, setLikesBackList] = useState([]);

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

      const getCurrentPetDets = localStorage.getItem('pet');
      setCurrentPetDetails(JSON.parse(getCurrentPetDets));

      async function fetchRequests() {
        const formData = {
            pet_id_recieve: JSON.parse(getCurrentPetDets).petId,
            status: "accepted"
        };
    
        const formDataToSend = new FormData();
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }
  
        try {

          const response = await fetch(`${rootUrl}getRequests.php`, {
            method: 'POST',
            body: formDataToSend,
          });
          const data = await response.json();
          console.log(data);
          if(data.data) {
            setMyLikesList(data.data);
          }

          const formData2 = {
            pet_id_send: JSON.parse(getCurrentPetDets).petId,
            status: "accepted"
          };
      
          const formDataToSend2 = new FormData();
          for (const key in formData2) {
            formDataToSend2.append(key, formData2[key]);
          }

          try {
            const response = await fetch(`${rootUrl}getSentRequests.php`, {
              method: 'POST',
              body: formDataToSend2,
            });
            const data = await response.json();
            console.log(data);
            if(data.data) {
              setLikesBackList(data.data);
              console.log(myLikesList, likesBackList)
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
        }
  
      }
  
      fetchRequests();
    }
  }, []);

  const clickRegister = () => {
    router.push('/register');
  };

  const openProfile = (obj) => {
    localStorage.setItem('sendRequestPet', JSON.stringify(obj));
    router.push('/sendRequestProfile');
  };

  return (
    <div className={`main ${petprofileStyles.profileWrapper}`}>
      <div className={petprofileStyles.pageHeadingContainer}>
        <h1>QUICK LINKS</h1>
        <QuickLinks links={navlinks}></QuickLinks>
      </div>
      <div className={styles.formContainer}>
        FOLLOWERS!!
        {myLikesList.map((obj, index) => (
          <div key={index} className={styles.requestCont}>
              <div className={styles.imgCont}>
                  <Image
                      fill
                      src={obj.petImgType ? `data:${obj.petImgType};base64,${obj.petImg}`: '/images/paw.png'}
                      alt="Dog default alt Image"
                      className={styles.logoImg}
                      priority
                  />
              </div>
              <div className={styles.requestName}>{obj.petName}</div>
          </div>
        ))}
        
      </div>
      <div className={styles.formContainer}>
        FOLLOWING!!
        {likesBackList.map((obj, index) => (
          <div onClick={() => openProfile(obj)} key={index} className={styles.requestCont}>
              <div className={styles.imgCont}>
                  <Image
                      fill
                      src={obj.petImgType ? `data:${obj.petImgType};base64,${obj.petImg}`: '/images/paw.png'}
                      alt="Dog default alt Image"
                      className={styles.logoImg}
                      priority
                  />
              </div>
              <div className={styles.requestName}>{obj.petName}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetConnections;