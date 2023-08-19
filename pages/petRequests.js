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


const PetRequests = () => {

  const router = useRouter();
  const [navlinks, setNavLinks] = useState([]);
  const [currentPetDetails, setCurrentPetDetails] = useState({}); // reciever
  const [status, setStatus] = useState('');
  const [requestsList, setRequestsList] = useState([]);

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
      setCurrentPetDetails(JSON.parse(getCurrentPetDets)); // reciever

      async function fetchRequests() {
        const formData = {
            pet_id_recieve: JSON.parse(getCurrentPetDets).petId,
            status: "pending"
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
            setRequestsList(data.data);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
        }
  
      }
  
      fetchRequests();
    }
  }, []);

  const updateRequest = async(petid, status) => {
    const formData = {
      pet_id_send: petid,
      pet_id_recieve: currentPetDetails.petId,
      status: status
    };

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(`${rootUrl}updateRequestStatus.php`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.success) {
          alert("successfully updated connection");
          window.location.reload();
        } 
        else if (responseData.error) {
          alert(responseData.error);
        } 
        else {
          console.error('updation failed.');
        }
      } 
      else {
        console.error('Updation failed.');
      }

    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const rejectRequest = async() => {
    window.location.reload();
  };

  return (
    <div className={`main ${petprofileStyles.profileWrapper}`}>
      <div className={petprofileStyles.pageHeadingContainer}>
        <h1>QUICK LINKS</h1>
        <QuickLinks links={navlinks}></QuickLinks>
      </div>
      <div className={styles.formContainer}>

        {requestsList.map((obj, index) => (
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
            <div className={styles.icons}>
                <span onClick={() => updateRequest(obj.petId, "accepted")} className={styles.accept}><FontAwesomeIcon icon={faCheck} /></span>
                <span onClick={() => updateRequest(obj.petId, "rejected")} className={styles.reject}><FontAwesomeIcon icon={faXmark} /></span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default PetRequests;