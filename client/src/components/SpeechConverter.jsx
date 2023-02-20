import React, { useState } from 'react';
import LoadingSpin from "react-loading-spin";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import openAiApi from '../requests/OpenAi';

const SpeechConverter = ({ authdUser, color }) => {
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
		isMicrophoneAvailable
	} = useSpeechRecognition();

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn't support speech recognition.</span>;
	};

	const getSentiment = (e) => {
		e.preventDefault();
		setCopied(false);
		setLoading(true);
		openAiApi.SentimentAnalysis(transcript, authdUser.auth, authdUser.id)
			.then((res) => res.json())
			.then((data) => {
				setLoading(false);
				setResult(data[0].text);
				return (data[1]);
			})
			.then((tokenUsage) => {
				console.log(tokenUsage);
			})
	};

	const getProfessional = (e) => {
		e.preventDefault();
		setLoading(true);
		openAiApi.Professionalize(transcript, authdUser.auth, authdUser.id)
			.then((res) => res.json())
			.then((data) => {
				setLoading(false);
				setResult(data[0].text);
				return (data[1]);
			})
			.then((tokenUsage) => {
				console.log(tokenUsage);
			})
	};

	const getSpellcheck = (e) => {
		e.preventDefault();
		setLoading(true);
		openAiApi.Spellcheck(transcript, authdUser.auth, authdUser.id)
			.then((res) => res.json())
			.then((data) => {
				setLoading(false);
				setResult(data[0].text);
				return (data[1]);
			})
			.then((tokenUsage) => {
				console.log(tokenUsage);
			})
	};

	return (
		<>
			<div>
				<p>{isMicrophoneAvailable? listening ? 'Speak' : 'Press to record' : <></>}</p>
				<div className='inputs-container'>
					{
						isMicrophoneAvailable
							? <><div className='control-buttons'>
								{
									transcript
										? !listening
											? <div className='record-button-inactive' onClick={() => { SpeechRecognition.startListening({ continuous: true }); }}></div>
											: <></>
										: !listening
											? <div className='record-button-inactive' onClick={() => { SpeechRecognition.startListening({ continuous: true }); }}></div>
											: <></>
								}

								{
									listening
										? <div onClick={SpeechRecognition.stopListening} className='pause-button'></div>
										: transcript && !listening
											? <></>
											: <></>
								}
								{
									transcript && !listening
										? <div onClick={() => { resetTranscript(); setResult(null); }} className='cancel-button'></div>
										: <></>
								}
							</div>
								<div className='voice-input'>
									{transcript ? <p>{transcript}</p> : <></>}
								</div>
								{
									transcript && !listening
										? <div className='ai-options'>
											<button style={{ backgroundColor: color || '#24824b' }} onClick={getSpellcheck}>Spellcheck/Grammar</button>
											<button style={{ backgroundColor: color || '#24824b' }} onClick={getSentiment}>Sentiment Analysis</button>
											<button style={{ backgroundColor: color || '#24824b' }} onClick={getProfessional}>Professionalize</button>
										</div>
										: <></>
								}</>
							: <>
								<p>Enable microphone and reload to start</p>
							</>
					}
				</div>
			</div>
			<div className='load-result'>
				<div className='load-spin'>
					{
						loading
							? <LoadingSpin
								duration="2s"
								width="15px"
								timingFunction="ease-in-out"
								direction="alternate"
								size="50px"
								primaryColor={color}
								secondaryColor="#333"
								numberOfRotationsInAnimation={2}
							/>
							: <></>
					}
				</div>
				{
					result !== null && !loading
						? <>
							<div className='result-container'>
								<p>{result}</p>
							</div>
							<div className='copy'>
								<CopyToClipboard text={result} onCopy={() => { setCopied(true); }}>
									<button style={{ backgroundColor: color || '#24824b' }}>Copy</button>
								</CopyToClipboard>
								<button style={{ backgroundColor: color || '#24824b' }} onClick={() => { setResult(null); setCopied(false); }}>Clear</button>
							</div>
							{copied ? <p>Copied to clipboard</p> : <></>}
						</>
						: <div className='result-container'></div>
				}
			</div>
		</>
	);
};
export default SpeechConverter;