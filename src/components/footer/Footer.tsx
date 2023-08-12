import React from 'react';
import styles from './Footer.module.scss';

function Footer() {
    const { footerContainer } = styles;
    
  return <footer className={footerContainer}>Footer</footer>;
}

export default Footer;
