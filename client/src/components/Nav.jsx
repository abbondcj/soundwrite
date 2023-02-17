import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/soundWriteLogo.png';
import '../styles/nav.css';

const Nav = ({ theme }) => {
  return (
    <div className='nav' style={{background: theme}}>
      <div className='home-link-container'>
        <Link className='nav-link' to='/'><div className='home-link'></div></Link>
      </div>
      <div className='logo-container'>
        <img src={logo} alt='logo' />
      </div>
      <div className='profile-logout-container'>
        <Link className='nav-link' to='/profile'><div className='profile-link'></div></Link>
      </div>
    </div>
  );
};

export default Nav;
