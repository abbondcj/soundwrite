import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = ({ setAuthdUser }) => {
	const [userEmail, setEmail] = useState(null);
	const [userPassword, setPassword] = useState(null);
	const [loginButton, setLoginButton] = useState(false);
	const [userExist, setUserExist] = useState(true);
	const navigate = useNavigate();

	const submitLogin = (e) => {
		e.preventDefault();
		const email = userEmail
		const password = userPassword
		fetch('54.83.227.27:9000/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password
			}),
		})
			.then((res) => {
				if (res.status === 200) {
					return (res.json());
				} else if (res.status === 401) {
					setUserExist(false);
					return (null);
				} else {
					return (null);
				}
			})
			.then((data) => {
				if (data !== null) {
					setAuthdUser({
						id: data[0].id,
						username: data[0].username,
						email: data[0].email,
                        auth: data[1],
						theme: data[0].theme
					});
					localStorage.setItem("vmail_user", JSON.stringify(
						{
							id: data[0].id,
							username: data[0].username,
							email: data[0].email,
                            auth: data[1]
						}
					));
					localStorage.setItem("user_theme", data[0].theme);
					navigate('/');
					setEmail(null);
					setPassword(null);
				}
			});
	};

	const setUserLoginState = (setFunction, value) => {
		setFunction(value);
		setUserExist(true);
		let nullDetect = false;
		for (const state of [userEmail, userPassword, value]) {
			if (state === null) {
				nullDetect = true;
			} else if (state.trim() === "") {
				nullDetect = true;
			}
		}
		const passwordInput = document.getElementById('user-password');
		const emailInput = document.getElementById('user-email');
		if (passwordInput === document.activeElement && passwordInput && value) {
			nullDetect = false
		}
		if (emailInput === document.activeElement && userPassword && value) {
			nullDetect = false;
		}
		nullDetect ? setLoginButton(false) : setLoginButton(true);
	};

	return (
		<div>
			<h1>Login</h1>
			<form className='login-form' onSubmit={submitLogin}>
				<input id='user-email' required onChange={(e) => { setUserLoginState(setEmail, e.target.value); }} type='email' placeholder='email' />
				<input id='user-password' required onChange={(e) => { setUserLoginState(setPassword, e.target.value); }} type='password' placeholder='password' />
				{
					!userExist
						? <p>Email/Password combination not found. Register <a href='/register'>here</a>.</p> : <></>
				}
				{
					loginButton && userExist
						? <input style={{backgroundColor: '#24824b', color: 'white'}} className='login-submit' type='submit' />
						: <input className='login-submit' disabled type='submit' />
				}
				<Link className='link-button' to='/'>Back</Link>
			</form>
		</div>
	);
};

export default Login;
