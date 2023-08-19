import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import profileStyles from '@/styles/Profile.module.css';
import registerstyles from '@/styles/Register.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/router';
import QuickLinks from '@/components/QuickLinks';
import { links } from '@/components/utils/constants';
import { faEnvelope, faHandPointDown, faLocationDot, faPaw, faPhone } from '@fortawesome/free-solid-svg-icons';
import FormInput from '@/components/FormInput';
import { emailValidation, emptySelectValidation, stringValidation, rootUrl } from '@/components/utils/constants';

const EditProfile = () => {

  const router = useRouter();
  const [navlinks, setNavLinks] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState({});
  const [locations, setLocations] = useState([]);
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('0');
  const [about, setAbout] = useState('');
  const [imgType, setImgType] = useState(null);
  const [imgCont, setImgCont] = useState(null);
  const [error, setError] = useState('');
  const [ownerImg, setOwnerImg] = useState(null);
  const [checkImgStatus, setCheckImgStatus] = useState(0);  // 0=no change, 1=edit, 2=delete

  useEffect(() => {
    const checkLogin = localStorage.getItem('owner');
    if (!checkLogin) {
      router.push('/login');
    }
    else {
      fetchLocations()
      .then(locations => {
        // set the array for locations
        var obj = {};
        var arr = [];
        for(var i=0; i<locations.length; i++) {
          obj.id = locations[i]["location_id"];
          obj.val = locations[i]["location_id"];
          obj.name = locations[i]["location_name"];
          arr.push(obj);
          obj = {};
        }
        setLocations(arr);
        
        const linklist = [];
        for (let i = 0; i < links.length; i++) {
          linklist[i] = links[i];
          linklist[i]['onclick'] = ()=>{router.push(linklist[i]['path'])};
        }
        setNavLinks(linklist);

        const ownerDets = JSON.parse(checkLogin);
        setOwnerDetails(ownerDets);
        setFName(ownerDets.fName);
        setLName(ownerDets.lName);
        setContact(ownerDets.contact);
        setLocation(ownerDets.location);
        setAbout(ownerDets.about);
        setImgType(ownerDets.ownerImgType);
        setImgCont(ownerDets.ownerImg);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  }, []);

  function fetchLocations() {
    return fetch(`${rootUrl}locations.php`)
      .then(response => response.json());
  }

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setCheckImgStatus(1);
    setOwnerImg(imageFile);
  };

  const onInputChange = (event) => {
    if(event.target.id == 'fName') {
      setFName(event.target.value);
    }
    else if(event.target.id == 'lName') {
      setLName(event.target.value);
    }
    else if(event.target.id == 'cInfo') {
      setContact(event.target.value);
    }
    else if(event.target.id == 'location') {
      setLocation(event.target.value);
    }
    else if(event.target.id == 'about') {
      setAbout(event.target.value);
    }
  };

  const deleteImage = () => {
    setImgType(null);
    setImgCont(null);
    setCheckImgStatus(2);
    alert("Image deleted");
  };

  const submitForm = async() => {

    // validation
    if(stringValidation(fName) == false) {
      setError("Please fill the first name");
    }
    else if(stringValidation(lName) == false) {
      setError("Please fill the last name");
    }
    else if(stringValidation(contact) == false) {
      setError("Please fill the contact information");
    }
    else if(emptySelectValidation(location) == false) {
      setError("Please select location");
    }

    // after validation
    else {
      setError("");
      const formData = {
        fName: fName,
        lName: lName,
        contact: contact,
        location: location,
        about: about,
        email: ownerDetails.email,
        imgStat: checkImgStatus,
        ownerImg: ownerImg,
      };

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      try {
        const response = await fetch(`${rootUrl}editOwner.php`, {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          const responseData = await response.json();

          if (responseData.success) {
            
            const newDetailsObj = {
              'ownerId': ownerDetails.ownerId,
              'fName': responseData.data.fName,
              'lName' : responseData.data.lName,
              'contact': responseData.data.contact,
              'location': responseData.data.location,
              'about': responseData.data.about,
              'email': ownerDetails.email,
              'ownerImg': checkImgStatus == 0 ? ownerDetails.ownerImg : responseData.data.ownerImg, // Convert BLOB image to base64
              'ownerImgType': checkImgStatus == 0 ? ownerDetails.ownerImgType : responseData.data.ownerImgType,
              'locationName': responseData.data.locationName
            }
            localStorage.setItem('owner', JSON.stringify(newDetailsObj));
            
            alert("Updation of owner successful");
            //after successful registration go to login page
            router.push('/profile');
          } 
          else if (responseData.error) {
            alert(responseData.error);
          } 
          else {
            console.error('Updation failed.');
          }
        } 
        else {
          console.error('Updation failed.');
        }

      } catch (error) {
        console.error('Error updating:', error);
      }

    }

    // router.push('/profile');
  };

  return (
    <div className={`main ${profileStyles.profileWrapper}`}>
      <div className={profileStyles.pageHeadingContainer}>
        <h1>QUICK LINKS</h1>
        <QuickLinks links={navlinks}></QuickLinks>
      </div>
      <div className={profileStyles.formContainer}>
        <FormInput
          label="First Name*"
          type="text"
          name="fName"
          value={fName}
          placeholder="Enter your First Name"
          onChange={onInputChange}
        />
        <FormInput
          label="Last Name*"
          type="text"
          name="lName"
          value={lName}
          placeholder="Enter your Last Name"
          onChange={onInputChange}
        />
        <FormInput
          label="Contact Info*"
          type="textarea"
          name="cInfo"
          value={contact}
          placeholder="Phone: xxx, Email: abc@ex.com, so on"
          onChange={onInputChange}
        />
        <FormInput
          label="Pick Location*"
          type="select"
          name="location"
          value={location}
          placeholder="Select Location"
          onChange={onInputChange}
          list={locations}
        />
        <FormInput
          label="About yourself"
          type="textarea"
          name="about"
          value={about}
          placeholder="Tell us about you."
          onChange={onInputChange}
        />
        <FormInput
          label="Edit image"
          type="file"
          name="oImage"
          value=""
          placeholder="Upload Image"
          onChange={handleImageChange}
        />
        <span onClick={deleteImage} className={registerstyles.deleteButton}>
          Remove image
        </span>

        <div className='error'>
          {error}
        </div>

        <div className={registerstyles.submitButton} onClick={submitForm}>
          Update profile &nbsp; <span><FontAwesomeIcon icon={faPaw}/></span>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;