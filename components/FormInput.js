import React from 'react';
import Image from 'next/image'
import Link from 'next/link';
import styles from '@/styles/FormInput.module.css'

const FormInput = ({ label, type, name, id, value, placeholder, onChange, list }) => {

  return (
    <div className={styles.inputContainer}>
        {label != '' ?<label htmlFor={name}>{label}</label> : ''}
        { type == 'select' ? 
            <select className={styles.selectDropdown} name={name} id={id ?? name} value={value} defaultValue={value} onChange={onChange}>
                <option value="0">Select {name}</option>
                {list.map((obj, index) => (
                    <option key={index} value={obj.val}>{obj.name}</option>
                ))}
            </select>
            : type == 'textarea' ?
            <textarea
                id={id ?? name}
                name={name}
                defaultValue={value}
                placeholder={placeholder}
                onChange={onChange}
                rows = "5"
                className={styles.textArea}
            ></textarea>
            : type == 'radio' ?
            <input
                type={type}
                id={id}
                name={name}
                defaultValue={value}
                placeholder={placeholder}
                onChange={onChange}
            /> 
            :
            <input
                type={type}
                id={id ?? name}
                name={name}
                defaultValue={value}
                placeholder={placeholder}
                onChange={onChange}
            />
        }
    </div>
  );
};

export default FormInput;
