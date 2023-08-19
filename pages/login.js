import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import styles from '@/styles/Register.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/router';
import { faPaw, faForward } from "@fortawesome/free-solid-svg-icons";
import FormInput from '@/components/FormInput';
import { emailValidation, emptySelectValidation, stringValidation, rootUrl } from '@/components/utils/constants';

const Login = () => {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkLogin = localStorage.getItem('owner');
    if (checkLogin) {
      router.push('/profile');
    }
  }, []);

  const clickRegister = () => {
    router.push('/register');
  };

  const onInputChange = (event) => {
    if(event.target.id == 'emailL') {
      setEmail(event.target.value);
    }
    else if(event.target.id == 'passwordL') {
      setPassword(event.target.value);
    }
  };

  const submitForm = async () => {
    console.log("submit login form");
    console.log(email, password);

    // validation
    if(stringValidation(password) == false) {
      setError("Please fill the password");
    }
    else if(stringValidation(email) == false || emailValidation(email) == false) {
      setError("Please fill the email properly");
    }

    // after validation
    else {
      setError("");
      console.log("complete");
      const formData = {
        email: email,
        password: password
      };

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      try {
        const response = await fetch(`${rootUrl}login.php`, {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);

          if (responseData.success) {
            console.log('Login successful.');
            alert("Login successful! Moving to profile->");
            console.log(responseData);
            localStorage.setItem('owner', JSON.stringify(responseData.data));
            //after successful registration go to login page
            window.location.reload();
            setTimeout(() => {
              router.push('/profile');
            }, 1000);
          } 
          else if (responseData.error) {
            alert(responseData.error);
          } 
          else {
            console.error('Login failed.');
          }
        } 
        else {
          console.error('Login failed.');
        }

      } catch (error) {
        console.error('Error login:', error);
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
          <span>Login</span> as an existing pet owner and explore &nbsp;
          <span>
            <FontAwesomeIcon
              icon={faPaw}
            />
          </span>
        </div>
        <div className={styles.loginButton} onClick={clickRegister}>
          New user? REGISTER NOW &nbsp; <span><FontAwesomeIcon icon={faForward}/></span>
        </div>
      </div>
      <div className={styles.formContainer}>
        <FormInput
          label="Email*"
          type="text"
          name="emailL"
          value={email}
          placeholder="abc@example.com"
          onChange={onInputChange}
        />
        <FormInput
          label="Password*"
          type="password"
          name="passwordL"
          value={password}
          placeholder="Enter Password"
          onChange={onInputChange}
        />
        <div className='error'>
          {error}
        </div>
        <div className={styles.submitButton} onClick={submitForm}>
          LOGIN &nbsp; <span><FontAwesomeIcon icon={faPaw}/></span>
        </div>
      </div>
    </div>
  );
};

export default Login;