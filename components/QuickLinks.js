import React from 'react';
import Image from 'next/image'
import Link from 'next/link';
import styles from '@/styles/QuickLinks.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointRight } from '@fortawesome/free-solid-svg-icons';

const QuickLinks = ({ links }) => {

  return (
    <div className={styles.linksContainer}>
        <ul className={styles.list}>
        {links.map((obj, index) => (
            <li key={index} onClick={obj.onclick}><span><FontAwesomeIcon icon={faHandPointRight} /></span>{obj.name}</li>
        ))}
        </ul>
    </div>
  );
};

export default QuickLinks;
