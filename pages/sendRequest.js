import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import petprofilestyles from '@/styles/PetProfile.module.css';
import styles from '@/styles/SendRequests.module.css';
import liststyles from '@/styles/PetsList.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/router';
import QuickLinks from '@/components/QuickLinks';
import { petlinks } from '@/components/utils/constants';
import { faFilter, faMagnifyingGlass, faNotesMedical, faPaw, faPhone, faScaleBalanced, faSyringe, faTransgender, faXmark } from '@fortawesome/free-solid-svg-icons';
import FormInput from '@/components/FormInput';
import { decimalValidationAndConversion, numberValidation, emailValidation, emptySelectValidation, stringValidation, rootUrl } from '@/components/utils/constants';


const SendRequest = () => {

  const router = useRouter();
  const [navlinks, setNavLinks] = useState([]);
  const [filter, setFilter] = useState(false);
  const [species, setSpecies] = useState([]);
  const [genders, setGenders] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [specie, setSpecie] = useState('0');
  const [gender, setGender] = useState('0');
  const [size, setSize] = useState('0');
  const [petname, setPetname] = useState('');
  const [petsList, setPetsList] = useState([]);

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

  const onInputChange = (event) => {
    if(event.target.name == 'species') {
      setSpecie(event.target.value);
    }
    else if(event.target.name == 'gender') {
      setGender(event.target.value);
    }
    else if(event.target.name == 'sizes') {
      setSize(event.target.value);
    }
    else if(event.target.name == 'searchInput') {
        setPetname(event.target.value);
    }
  };

  const toggleFilter = () => {
    setFilter(!filter);
  };

  const submitForm = async() => {
    console.log(specie, gender, size, petname);

    const formData = {
        ownerId: JSON.parse(localStorage.getItem('pet')).ownerId,
        name: petname,
        size: size, 
        gender: gender,
        species: specie
    };

    const formDataToSend = new FormData();
    for (const key in formData) {
        formDataToSend.append(key, formData[key]);
    }

    try {
        const response = await fetch(`${rootUrl}filteredPets.php`, {
        method: 'POST',
        body: formDataToSend,
        });
        const data = await response.json();
        console.log(data.data);
        setPetsList(data.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  const openProfile = (obj) => {
    localStorage.setItem('sendRequestPet', JSON.stringify(obj));
    router.push('/sendRequestProfile');
  };

  return (
    <div className={`main ${petprofilestyles.profileWrapper}`}>
      <div className={petprofilestyles.pageHeadingContainer}>
        <h1>QUICK LINKS</h1>
        <QuickLinks links={navlinks}></QuickLinks>
      </div>
      <div className={petprofilestyles.formContainer}>
        <div className={styles.filterArea}>
            <div className={styles.searchText}>
                <FormInput
                    label=""
                    type="text"
                    name="searchInput"
                    value={petname}
                    placeholder="Search by name"
                    onChange={onInputChange}
                />
            </div>
            <div className={styles.icon} onClick={toggleFilter}><FontAwesomeIcon icon={faFilter}/></div>
            <div className={styles.search} onClick={submitForm}>
                Search <span><FontAwesomeIcon icon={faMagnifyingGlass}/></span>
            </div>
        </div>
        {
            filter ? 
            <div className={styles.filterBox}>
                <div className={styles.category}>
                    <div className={styles.categoryName}>
                        Species 
                        {/* <span onClick={() => {setSpecie('0')}}><FontAwesomeIcon icon={faXmark}/></span> */}
                    </div>
                    <div className={styles.categoryList}>
                        {species.map((obj, index) => (
                            <FormInput
                                key={index}
                                label={obj.name}
                                type="radio"
                                name="species"
                                id={obj.name}
                                value={obj.name}
                                placeholder=""
                                onChange={onInputChange}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.category}>
                    <div className={styles.categoryName}>
                        Gender 
                        {/* <span onClick={() => {setGender('0')}}><FontAwesomeIcon icon={faXmark}/></span> */}
                    </div>
                    <div className={styles.categoryList}>
                        {genders.map((obj, index) => (
                            <FormInput
                                key={index}
                                label={obj.name}
                                type="radio"
                                name="gender"
                                id={obj.name}
                                value={obj.name}
                                placeholder=""
                                onChange={onInputChange}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.category}>
                    <div className={styles.categoryName}>
                        Size 
                        {/* <span onClick={() => {setSize('0')}}><FontAwesomeIcon icon={faXmark}/></span> */}
                    </div>
                    <div className={styles.categoryList}>
                        {sizes.map((obj, index) => (
                            <FormInput
                                key={index}
                                label={obj.name}
                                type="radio"
                                name="sizes"
                                id={obj.name}
                                value={obj.name}
                                placeholder=""
                                onChange={onInputChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
            : null
        }
        <div className={styles.suggestions}>
            <ul className={liststyles.petList}>
                {petsList.map((obj, index) => (
                    <li key={index} onClick={() => openProfile(obj)}>
                        <div className={liststyles.imgCont}>
                            <Image
                                fill
                                src={obj.petImgType ? `data:${obj.petImgType};base64,${obj.petImg}`: '/images/paw.png'}
                                alt="Pet default Image"
                                className={liststyles.logoImg}
                                priority
                            />
                        </div>
                        <div className={liststyles.petName}>{obj.petName}</div>
                    </li>
                ))}
                
            </ul>
        </div>
      </div>
    </div>
  );
};

export default SendRequest;