import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/soundWriteLogo.png';
import '../styles/landing.css';

function Landing() {
  const [phrase, setPhrase] = useState(null);
  const interval = 3000
  setTimeout(() => {
    let number = Math.floor(Math.random() * 6);
    const wordChoices = ["create messages...", "create memos...", "create blogs...", "create articles...", "analyze your writing...", "sound more professional..."];
    if (wordChoices[number] === phrase) {
      number === 0 ? number += 1 : number -= 1
      setPhrase(wordChoices[number])
    } else {
      setPhrase(wordChoices[number]);
    }
  }, interval)
  return (
    <div className='landing-container'>
      <div className='landing-header'>
        <img src={logo} alt='logo' />
      </div>
      <div className='preview'>
        <h2>Use SoundWrite to</h2>
        <h2>{phrase === null ? 'create emails...' : ` ${phrase}`}</h2>
      </div>
      <div>
        <p><Link className='link-button' to='/login'>Login</Link></p>
        <p>Don't have an account? Register <Link className='link-button' to='/register'>here</Link>.</p>
      </div>
    </div>
  )
}

export default Landing;
