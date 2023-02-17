import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
const Unauthorized = ({ setLogin }) => {
  return (
    <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login setAuthdUser={setLogin}/>} />
        <Route path='*' element={<Landing />} />
    </Routes>
  );
};

export default Unauthorized;
