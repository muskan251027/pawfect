import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/PetProfile.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/router';
import QuickLinks from '@/components/QuickLinks';
import { petlinks } from '@/components/utils/constants';
import { faEnvelope, faLocationDot, faNotesMedical, faPaw, faPhone, faScaleBalanced, faSyringe, faTransgender } from '@fortawesome/free-solid-svg-icons';
import { decimalValidationAndConversion, numberValidation, emailValidation, emptySelectValidation, stringValidation, rootUrl } from '@/components/utils/constants';

const SendRequestProfile = () => {

  const router = useRouter();
  const [navlinks, setNavLinks] = useState([]);
  const [currentPetDetails, setCurrentPetDetails] = useState({}); // sender
  const [petDetails, setPetDetails] = useState({});  // reciever
  const [ownerDetails, setOwnerDetails] = useState({});
  const [status, setStatus] = useState('');
  const [statusLbl, setStatusLbl] = useState('');
  const statusArray = ['Send Request', 'Remove Connection', 'Accept Request', 'Cancel Request'];

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

      setOwnerDetails(JSON.parse(localStorage.getItem('owner')));

      const getPetDets = localStorage.getItem('sendRequestPet');
      setPetDetails(JSON.parse(getPetDets)); // reciever

      const getCurrentPetDets = localStorage.getItem('pet');
      setCurrentPetDetails(JSON.parse(getCurrentPetDets)); // sender

      async function fetchStatus() {
        const formData = {
            pet_id_send: JSON.parse(getCurrentPetDets).petId,
            pet_id_recieve: JSON.parse(getPetDets).petId
        };
    
        const formDataToSend = new FormData();
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }
  
        try {

          const response = await fetch(`${rootUrl}checkConnection.php`, {
            method: 'POST',
            body: formDataToSend,
          });
          const data = await response.json();
          console.log(data);

          if(!data.success) { // if no connection, that means send request button
            setStatusLbl(statusArray[0]);
          }
          else {
            setStatus(data.request_status);
            if(data.request_status == 'accepted') { // if accepted, remove connection
                setStatusLbl(statusArray[1]);
            }
            else {
                if(data.request_status == 'rejected') { // if rejected, cancel request button
                    setStatusLbl(statusArray[3])
                }
                else {
                    if(data.request_status == 'pending') { // if pending, cancel request button
                        setStatusLbl(statusArray[3]);
                    }
                }
            }
          }

        } catch (error) {
          console.error('Error fetching data:', error);
        }
  
      }
  
      fetchStatus();
    }
  }, []);

  const handleConnection = async() => {
    console.log(status);
    const formData = {
        pet_id_send: currentPetDetails.petId,
        pet_id_recieve: petDetails.petId,
        status: status
    };

    const formDataToSend = new FormData();
    for (const key in formData) {
        formDataToSend.append(key, formData[key]);
    }

    try {
        const response = await fetch(`${rootUrl}sendingConnection.php`, {
        method: 'POST',
        body: formDataToSend,
        });
        const data = await response.json();
        console.log(data);
        window.location.reload();
    } catch (error) {
        console.error('Error fetching data:', error);
    }

  }

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
            <div onClick={handleConnection} className={styles.status}>{statusLbl}</div>
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
        {
            status == 'accepted' ?
            <div className={styles.personalInfo}>
                <h1>Owner Contact Information</h1>
                <div><FontAwesomeIcon icon={faEnvelope} /> <span>{ownerDetails.email}</span></div>
                <div><FontAwesomeIcon icon={faPhone} /> <span>{ownerDetails.contact}</span></div>
                <div><FontAwesomeIcon icon={faLocationDot} /> <span>{ownerDetails.locationName}</span></div>
            </div>
            : null
        }
      </div>
    </div>
  );
};

export default SendRequestProfile;