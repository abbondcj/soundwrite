import React, { useEffect, useState } from 'react'
import SpeechConverter from '../components/SpeechConverter'
import '../styles/home.css';

const SpeechToText = ({ authdUser, theme }) => {
  const [hideInfo, setHideInfo] = useState(true);

  return (
    <>
      <div className='home'>
        <h3>Welcome {authdUser.username}</h3>
        <div className='home-detail-container'>
          {
            hideInfo
              ? <></>
              : <div style={{border: `solid ${theme} 2px`, borderRadius: '10px'}} className='home-detail'>
                  <h3>Use your voice to generate...</h3>
                  <p>Emails</p>
                  <p>Blogs & articles</p>
                  <p>LinkedIn Messages</p>
                </div>
          }
          {
            hideInfo
              ? <div onClick={() => { setHideInfo(false); }} className='show-icon'></div>
              : <div onClick={() => { setHideInfo(true); }} className='hide-icon'></div>
          }
          {
            hideInfo
              ? <></>
              : <div style={{border: `solid ${theme} 2px`, borderRadius: '10px'}} className='home-detail'>
                  <h3>Utilize OpenAI engine for...</h3>
                  <p>Professionalism</p>
                  <p>Sentiment analysis</p>
                  <p>Grammar & spelling</p>
                </div>
          }
        </div>
      </div>
      <SpeechConverter color={theme} authdUser={authdUser} />
    </>
  )
}

export default SpeechToText;
