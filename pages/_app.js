import '@/styles/globals.css'
// import Font Awesome CSS
import "@fortawesome/fontawesome-svg-core/styles.css"; 
import { config } from "@fortawesome/fontawesome-svg-core";
// Tell Font Awesome to skip adding the CSS automatically 
// since it's already imported above
config.autoAddCss = false; 
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function App({ Component, pageProps }) {
  // return <Component {...pageProps} />
  return (
    <>
      <div className='wrapper'>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </>
  );
}
