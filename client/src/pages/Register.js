import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/register.css';

const Register = () => {
  const [userUsername, setUsername] = useState(null);
  const [userEmail, setEmail] = useState(null);
  const [userPassword, setPassword] = useState(null);
  const [userConfirmPassword, setConfirmPassword] = useState(null);
  const [registerButton, setRegisterButton] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const submitRegister = (e) => {
    e.preventDefault();
    setEmailExists(false);
    const username = userUsername
    const email = userEmail
    const password = userPassword
    fetch(':9000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return (res.json());
        } else if (res.status === 400) {
          setEmailExists(true);
        } else {
          return (null);
        }
      })
      .then((data) => {
        if (data !== null) {
          localStorage.setItem("vmail_user", JSON.stringify(
            {
              id: data[0].id,
              username: data[0].username,
              email: data[0].email,
              auth: data[1]
            }
          ));
          localStorage.setItem("user_theme", data[0].theme)
          window.location.replace('/');
        }
      });
  };

  const setUserRegisterState = (setFunction, value) => {
    setFunction(value);
    let nullDetect = false;
    for (const state of [userUsername, userEmail, userPassword, userConfirmPassword, value]) {
      if (state === null) {
        nullDetect = true;
      } else if (state.trim() === "") {
        nullDetect = true;
      }
    }
    nullDetect ? setRegisterButton(false) : setRegisterButton(true);
  };

  return (
    <div>
      <h1>Register</h1>
      <form className='register-form' onSubmit={submitRegister}>
        <input required onChange={(e) => { setUserRegisterState(setUsername, e.target.value); }} type='text' placeholder='username' />
        <input required onChange={(e) => { setUserRegisterState(setEmail, e.target.value); }} type='email' placeholder='email' />
        <input required onChange={(e) => { setUserRegisterState(setPassword, e.target.value); }} type='password' placeholder='password' />
        <input required onChange={(e) => { setUserRegisterState(setConfirmPassword, e.target.value); }} type='password' placeholder='confirm password' />
        {
          userPassword !== userConfirmPassword && userConfirmPassword
            ? <p>Passwords do not match</p>
            : <></>
        }
        {
          emailExists
            ? <p>Email already in use. Use another or <a className='link-button' href='/login'>Login</a>.</p> : <></>
        }
        {
          registerButton && userPassword === userConfirmPassword
            ? <input style={{ backgroundColor: '#24824b', color: 'white' }} className='register-submit' href="/" type='submit' />
            : <input className='register-submit' disabled type='submit' />
        }
        <Link className='link-button' to='/'>Back</Link>
      </form>
    </div>
  )
}

export default Register;
