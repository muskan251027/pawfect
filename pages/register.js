import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import styles from '@/styles/Register.module.css'
import inputStyles from '@/styles/FormInput.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/router';
import { faPaw, faForward } from "@fortawesome/free-solid-svg-icons";
import FormInput from '@/components/FormInput';
import { emailValidation, emptySelectValidation, stringValidation, rootUrl } from '@/components/utils/constants';

const Register = () => {

  const router = useRouter();
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('0');
  const [about, setAbout] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [locations, setLocations] = useState([]);
  const [ownerImg, setOwnerImg] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const checkLogin = localStorage.getItem('owner');
    if (checkLogin) {
      router.push('/profile');
    }
  }, []);

  useEffect(() => {
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
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  function fetchLocations() {
    return fetch(`${rootUrl}locations.php`)
      .then(response => response.json());
  }

  const clickLogin = () => {
    router.push('/login');
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
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
    else if(event.target.id == 'email') {
      setEmail(event.target.value);
    }
    else if(event.target.id == 'password') {
      setPassword(event.target.value);
    }
  };

  const submitForm = async() => {
    console.log("submit registeration form");
    console.log(fName, lName, contact, location, about, email, password, ownerImg);

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
    else if(stringValidation(password) == false) {
      setError("Please fill the password");
    }
    else if(stringValidation(email) == false || emailValidation(email) == false) {
      setError("Please fill the email properly");
    }
    else if(emptySelectValidation(location) == false) {
      setError("Please select location");
    }

    // after validation
    else {
      setError("");
      console.log("complete");
      const formData = {
        fName: fName,
        lName: lName,
        contact: contact,
        location: location,
        about: about,
        email: email,
        password: password,
        ownerImg: ownerImg,
      };

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      try {
        const response = await fetch(`${rootUrl}registerOwner.php`, {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          const responseData = await response.json();

          if (responseData.success) {
            console.log('Registration successful.');
            alert("Registration successful");
            //after successful registration go to login page
            router.push('/login');
          } 
          else if (responseData.error) {
            alert(responseData.error);
          } 
          else {
            console.error('Registration failed.');
          }
        } 
        else {
          console.error('Registration failed.');
        }

      } catch (error) {
        console.error('Error registering:', error);
      }

    }

  };

  return (
    <div className={`main ${styles.registerWrapper}`}>
      <div className={styles.pageHeadingContainer}>
        <div className={styles.imgCont}>
          <Image
            fill
            src="/images/paw.png"
            alt="Logo of website Image"
            className={styles.logoImg}
            priority
          />
        </div>
        <div className={styles.sectionHeading}>
          <span>Register</span> yourself as a new pet owner and join the community &nbsp;
          <span>
            <FontAwesomeIcon
              icon={faPaw}
            />
          </span>
        </div>
        <div className={styles.loginButton} onClick={clickLogin}>
          Login to existing account &nbsp; <span><FontAwesomeIcon icon={faForward}/></span>
        </div>
      </div>
      <div className={styles.formContainer}>
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
          label="Email*"
          type="text"
          name="email"
          value={email}
          placeholder="abc@example.com"
          onChange={onInputChange}
        />
        <FormInput
          label="Password*"
          type="password"
          name="password"
          value={password}
          placeholder="Enter Password"
          onChange={onInputChange}
        />
        <FormInput
          label="Upload image"
          type="file"
          name="oImage"
          value=""
          placeholder="Upload Image"
          onChange={handleImageChange}
        />

        <div className='error'>
          {error}
        </div>

        <div className={styles.submitButton} onClick={submitForm}>
          Register new account &nbsp; <span><FontAwesomeIcon icon={faPaw}/></span>
        </div>

      </div>
    </div>
  );
};

export default Register;