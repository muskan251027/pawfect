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
import { decimalValidationAndConversion, numberValidation, emailValidation, emptySelectValidation, stringValidation, rootUrl } from '@/components/utils/constants';

const AddPet = () => {

  const router = useRouter();
  const [navlinks, setNavLinks] = useState([]);
  const [species, setSpecies] = useState([]);
  const [genders, setGenders] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [petName, setPetName] = useState('');
  const [specie, setSpecie] = useState('0');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('0');
  const [size, setSize] = useState('0');
  const [weight, setWeight] = useState('');
  const [traits, setTraits] = useState('');
  const [health, setHealth] = useState('');
  const [vaccine, setVaccine] = useState('');
  const [petImg, setPetImg] = useState(null);
  const [error, setError] = useState('');

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

      fetchDropdowns()
      .then(arrays => {
        // set the array for locations

        // set species array
        var obj = {};
        var arr = [];
        for(var i=0; i<arrays.species.length; i++) {
          obj.id = arrays.species[i];
          obj.val = arrays.species[i];
          obj.name = arrays.species[i];
          arr.push(obj);
          obj = {};
        }
        setSpecies(arr);

        // set genders array
        var obj1 = {};
        var arr1 = [];
        for(var i=0; i<arrays.genders.length; i++) {
          obj1.id = arrays.genders[i];
          obj1.val = arrays.genders[i];
          obj1.name = arrays.genders[i];
          arr1.push(obj1);
          obj1 = {};
        }
        setGenders(arr1);

        // set sizes array
        var obj2 = {};
        var arr2 = [];
        for(var i=0; i<arrays.sizes.length; i++) {
          obj2.id = arrays.sizes[i];
          obj2.val = arrays.sizes[i];
          obj2.name = arrays.sizes[i];
          arr2.push(obj2);
          obj2 = {};
        }
        setSizes(arr2);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    }

  }, []);

  function fetchDropdowns() {
    return fetch(`${rootUrl}enums.php`)
      .then(response => response.json());
  }

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setPetImg(imageFile);
  };

  const onInputChange = (event) => {
    if(event.target.id == 'pName') {
      setPetName(event.target.value);
    }
    else if(event.target.id == 'species') {
      setSpecie(event.target.value);
    }
    else if(event.target.id == 'breed') {
      setBreed(event.target.value);
    }
    else if(event.target.id == 'age') {
      setAge(event.target.value);
    }
    else if(event.target.id == 'gender') {
      setGender(event.target.value);
    }
    else if(event.target.id == 'size') {
      setSize(event.target.value);
    }
    else if(event.target.id == 'weight') {
      setWeight(event.target.value);
    }
    else if(event.target.id == 'traits') {
      setTraits(event.target.value);
    }
    else if(event.target.id == 'health') {
      setHealth(event.target.value);
    }
    else if(event.target.id == 'vaccine') {
      setVaccine(event.target.value);
    }
  };

  const submitForm = async() => {
    console.log("submit pet registeration form");

    // validation
    if(stringValidation(petName) == false) {
      setError("Please fill the pet name");
    }
    else if(stringValidation(breed) == false) {
      setError("Please fill pet breed");
    }
    else if(numberValidation(age) == false) {
      setError("Please fill the pet age");
    }
    else if(decimalValidationAndConversion(weight) == null) {
      setError("Please fill correct weight");
    }
    else if(emptySelectValidation(specie) == false) {
      setError("Please select species");
    }
    else if(emptySelectValidation(gender) == false) {
      setError("Please select gender");
    }
    else if(emptySelectValidation(size) == false) {
      setError("Please select size");
    }
    else {
      setError("");
      setWeight(decimalValidationAndConversion(weight));
      
      const formData = {
        userId: JSON.parse(localStorage.getItem('owner')).ownerId,
        name: petName,
        species: specie,
        breed: breed,
        age: age,
        gender: gender,
        size: size,
        weight: weight,
        traits: traits,
        health: health,
        vaccine: vaccine,
        petImg: petImg,
      };

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      try {
        const response = await fetch(`${rootUrl}addPet.php`, {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          const responseData = await response.json();

          if (responseData.success) {
            alert("Pet registered successfully");
            //after successful registration go to login page
            localStorage.setItem('pet', JSON.stringify(responseData.data));
            router.push('/petProfile');
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
    <div className={`main ${profileStyles.profileWrapper}`}>
      <div className={profileStyles.pageHeadingContainer}>
        <h1>QUICK LINKS</h1>
        <QuickLinks links={navlinks}></QuickLinks>
      </div>
      <div className={profileStyles.formContainer}>
        <FormInput
          label="Name*"
          type="text"
          name="pName"
          value={petName}
          placeholder="Enter your Pet's Name"
          onChange={onInputChange}
        />
        <FormInput
          label="Species*"
          type="select"
          name="species"
          value={specie}
          placeholder="Select Species"
          onChange={onInputChange}
          list={species}
        />
        <FormInput
          label="Breed*"
          type="text"
          name="breed"
          value={breed}
          placeholder="Enter your Pet's breed"
          onChange={onInputChange}
        />
        <FormInput
          label="Age*"
          type="number"
          name="age"
          value={age}
          placeholder="Enter Pet's age"
          onChange={onInputChange}
        />
        <FormInput
          label="Gender"
          type="select"
          name="gender"
          value={gender}
          placeholder="Select Gender"
          onChange={onInputChange}
          list={genders}
        />
        <FormInput
          label="Size"
          type="select"
          name="size"
          value={size}
          placeholder="Select Size"
          onChange={onInputChange}
          list={sizes}
        />
        <FormInput
          label="Weight(kg)"
          type="text"
          name="weight"
          value={weight}
          placeholder="44.6"
          onChange={onInputChange}
        />
        <FormInput
          label="Personality traits*"
          type="textarea"
          name="traits"
          value={traits}
          placeholder="Playful, angry etc."
          onChange={onInputChange}
        />
        <FormInput
          label="Health Details*"
          type="textarea"
          name="health"
          value={health}
          placeholder="Young with healthy heart etc."
          onChange={onInputChange}
        />
        <FormInput
          label="Vaccination Details*"
          type="textarea"
          name="vaccine"
          value={vaccine}
          placeholder="Timely vaccinated etc."
          onChange={onInputChange}
        />
        <FormInput
          label="Upload image"
          type="file"
          name="pImage"
          value=""
          placeholder="Upload Image"
          onChange={handleImageChange}
        />

        <div className='error'>
          {error}
        </div>

        <div className={registerstyles.submitButton} onClick={submitForm}>
          Add new pet &nbsp; <span><FontAwesomeIcon icon={faPaw}/></span>
        </div>
      </div>
    </div>
  );
};

export default AddPet;