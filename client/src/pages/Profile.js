import React, { useEffect, useState } from 'react';
import userApi from '../requests/User';
import '../styles/profile.css';

const Profile = ({ authdUser, selectTheme, theme }) => {
  const [tokensAvailable, setTokensAvailable] = useState(0);
  const [newTheme, setNewTheme] = useState(false);
  const [color, setColor] = useState(null);

  const submitThemeChange = () => {
    console.log("theme change");
    const themeChoice = color;
    if (theme === localStorage.getItem("user_theme")) {
      setNewTheme(false)
    } else {
      userApi.UpdateTheme(authdUser.auth, authdUser.id, themeChoice)
      .then(() => {
        setNewTheme(false);
        localStorage.setItem("user_theme", color);
      });
    }
  }

  useEffect(
    () => {
      const savedTheme = localStorage.getItem("user_theme");
      if (savedTheme) {
        if (savedTheme !== theme) {
          setColor(theme);
          setNewTheme(true);
        }
      }
      userApi.GetTokens(authdUser.auth, authdUser.id)
      .then((res) => {
        if (res.status === 200) {
          return (res.json());
        } else {
          return (null);
        }
      })
      .then((data) => {
        const used = data.tokenUsage;
        const available = 50000 - (used - 1);
        setTokensAvailable(available);
      });
    }, []
  );

  return (
    <div>
      <h3>Profile</h3>
      <div className='theme-picker' style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', width: '50%', margin: 'auto', borderRadius: '10px'}}>
        <div id='purple' style={{width: '30px', height: '30px', borderRadius: '2px', backgroundColor: 'purple'}} className= 'color-option' onClick={(e) => { setColor(e.target.id); selectTheme("purple"); setNewTheme(true); }}></div>
        <div id='blue' style={{width: '30px', height: '30px', borderRadius: '2px', backgroundColor: 'blue'}} className= 'color-option' onClick={(e) => { setColor(e.target.id); selectTheme("blue"); setNewTheme(true); }}></div>
        <div id='red' style={{width: '30px', height: '30px', borderRadius: '2px', backgroundColor: 'red'}} className= 'color-option' onClick={(e) => { setColor(e.target.id); selectTheme("red"); setNewTheme(true); }}></div>
        <div id='pink' style={{width: '30px', height: '30px', borderRadius: '2px', backgroundColor: 'pink'}} className= 'color-option' onClick={(e) => { setColor(e.target.id); selectTheme("pink"); setNewTheme(true); }}></div>
        <div id='#24824b' style={{width: '30px', height: '30px', borderRadius: '2px', backgroundColor: '#24824b'}} className= 'color-option' onClick={(e) => { setColor(e.target.id); selectTheme("#24824b"); setNewTheme(true); }}></div>
        <div id='brown' style={{width: '30px', height: '30px', borderRadius: '2px', backgroundColor: 'brown'}} className= 'color-option' onClick={(e) => { setColor(e.target.id); selectTheme("brown"); setNewTheme(true); }}></div>
        <div id='orange' style={{width: '30px', height: '30px', borderRadius: '2px', backgroundColor: 'orange'}} className= 'color-option' onClick={(e) => { setColor(e.target.id); selectTheme("orange"); setNewTheme(true); }}></div>
        <div id='grey' style={{width: '30px', height: '30px', borderRadius: '2px', backgroundColor: 'grey'}} className= 'color-option' onClick={(e) => { setColor(e.target.id); selectTheme("grey"); setNewTheme(true); }}></div>

      </div>
      {
        newTheme
          ? <button style={{backgroundColor: theme || '#24824b', margin: '1%'}} onClick={submitThemeChange}>Save</button>
          : <></>
      }
      <div>
        <p><b>Username: </b>{authdUser.username}</p>
        <p><b>Email: </b>{authdUser.email}</p>
      </div>
      <div>
        <p><b>Credits Available</b></p>
        <p style={{color: theme || '#c5d1db'}}>{tokensAvailable.toLocaleString('en-US')}</p>
      </div>
      <div>
        <p><b>Credit Usage</b></p>
        <p>
          Credit usage is determined by the length of a text modification request.<br></br>
          750 words would require roughly 1,000 tokens to process a text modification request.
        </p>
      </div>
      <div>
        <button style={{backgroundColor: theme || '#24824b'}} onClick={() => { localStorage.removeItem("vmail_user"); localStorage.removeItem("user_theme"); localStorage.removeItem("show_converter_info"); window.location.replace('/');}}>Logout</button>
      </div>
    </div>
  )
}

export default Profile;
