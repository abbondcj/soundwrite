import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from '../components/Nav';
import SpeechToText from '../pages/SpeechToText';
import Profile from '../pages/Profile';
import Privacy from '../pages/Privacy';

const Authorized = ({ authdUser }) => {
	const [themeColor, setThemeColor] = useState()

	useEffect(
		() => {
			const theme = localStorage.getItem("user_theme");
			if (theme !== undefined) {
				setThemeColor(theme);
			} else {
				setThemeColor('#24824b')
			}
		}, []
	)

	return (
		<>
			<Nav theme={themeColor} />
			<Routes>
				<Route path='/' element={<SpeechToText theme={themeColor} authdUser={authdUser} />} />
                <Route path='/profile' element={<Profile authdUser={authdUser} selectTheme={setThemeColor} theme={themeColor} />} />
				<Route path='/privacy-policy' element={<Privacy />} />
				<Route path='*' element={<SpeechToText theme={themeColor} authdUser={authdUser} />} />
			</Routes>
		</>
	);
};

export default Authorized;
