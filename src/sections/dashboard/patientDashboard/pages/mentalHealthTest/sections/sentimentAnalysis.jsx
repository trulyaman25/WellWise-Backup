import React, { useState, useRef } from "react";
import Web3 from "web3";
import axios from "axios";
import MentalHealth from "../../../../../../build/contracts/MentalHealth.json";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import questionData from '../../../data/questionData.json';

function SentimentAnalysis({ step, patientDetails, tID }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({ textResponse: "", textTwo: "" });
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [ipfsHash, setIpfsHash] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const navigate = useNavigate();
    const {healthID} = useParams();

    const questions = questionData.sentiment.questions;
    const title = questionData.sentiment.title;

    const handleTextChange = (e) => {
        const { value } = e.target;
        setAnswers((prevAnswers) =>
            currentQuestion === 0
                ? { ...prevAnswers, textResponse: value }
                : { ...prevAnswers, textTwo: value }
        );
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(audioBlob);
                setAudioUrl(URL.createObjectURL(audioBlob));
                await uploadToPinata(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Error accessing microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const uploadToPinata = async (audioBlob) => {
        setIsUploading(true);
        try {
            const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        pinata_api_key: '04b26ee360171f03ae2b',
                        pinata_secret_api_key: '250fe3ce90862d18f94ced6c065a6bec5a956d528aef8ab9d737a9b3f0ca8065',
                    },
                }
            );

            setIpfsHash(response.data.IpfsHash);
        } catch (error) {
            console.error('Error uploading to Pinata:', error);
            alert('Error uploading audio');
        } finally {
            setIsUploading(false);
        }
    };

    const renderInputSection = () => {
        if (currentQuestion === 0) {
            return (
                <textarea
                    className="w-full h-[300px] font-albulaRegular p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#266666]"
                    placeholder="Type your response here..."
                    value={answers.textResponse}
                    onChange={handleTextChange}
                />
            );
        } else {
            return (
                <div className="space-y-4">
                    <textarea
                        className="w-full h-[150px] font-albulaRegular p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#266666]"
                        placeholder="Type your response here..."
                        value={answers.textTwo}
                        onChange={handleTextChange}
                    />
                    
                    <div className="flex flex-col space-y-4 mt-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={isUploading}
                                className={`px-6 py-2 rounded-xl text-white font-albulaBold ${
                                    isRecording ? 'bg-red-500' : 'bg-[#266666]'
                                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isRecording ? 'Stop Recording' : 'Start Recording'}
                            </button>
                            {isUploading && <span className="text-gray-600">Uploading...</span>}
                        </div>
                        {audioUrl && (
                            <div className="flex flex-col space-y-2">
                                <audio controls src={audioUrl} className="w-full" />
                                {ipfsHash && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">Audio stored on IPFS:</p>
                                        <a 
                                            href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#266666] hover:underline break-all"
                                        >
                                            {ipfsHash}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const payload = {
                text_1: answers.textResponse,
                text_2_ipfs: ipfsHash
            };
    
            const response = await fetch("http://localhost:5000/process_sentiment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log("Response from backend:", result);
    
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                MentalHealth.abi,
                MentalHealth.networks[networkId].address
            );
    
            await contract.methods
                .initializeSentimentDetails(
                    tID, 
                    answers.textResponse, 
                    result.text_2, // Use transcribed text from backend
                    result.ml_s1,
                    result.ml_s2,
                    result.score.toString()
                )
                .send({ from: patientDetails.walletAddress });
    
            const stopResponse = await axios.get('http://localhost:5000/stop_session');
            console.log(stopResponse.data);
    
            await contract.methods
                .initializeEmotionDetails(
                    tID, 
                    stopResponse.data.total_blinks.toString(),
                    stopResponse.data.blinks.toString(),
                    stopResponse.data.cv_score.toString()
                )
                .send({ from: patientDetails.walletAddress });
    
            console.log("Data successfully stored for sentiment analysis.");
            navigate(`/patient/ack/${healthID}/${tID}`);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while storing your sentiment analysis answers.");
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="w-full h-full p-10 mx-auto font-sans">
            <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col justify-between">
                <div>
                    <div className="p-6">
                        <h2 className="text-2xl font-albulaHeavy text-gray-800 mb-6">
                            {title}
                        </h2>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div
                                className="bg-[#266666] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <p className="text-lg font-albulaRegular text-gray-700 mb-6">
                            {questions[currentQuestion].text}
                        </p>

                        {renderInputSection()}
                    </div>
                </div>

                <div className="bg-[#eef8f7] rounded-3xl px-6 py-4 flex justify-between items-center">
                    <p className="text-sm font-albulaRegular text-gray-500">
                        Question {currentQuestion + 1} of {questions.length}
                    </p>

                    <div className="flex space-x-4">
                        <button
                            onClick={handleBack}
                            disabled={currentQuestion === 0}
                            className="px-4 py-2 rounded-xl text-slate-600 font-albulaBold disabled:hidden"
                        >
                            Back
                        </button>
                        {currentQuestion === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={!answers.textResponse || !answers.textTwo}
                                className={`px-10 py-2 rounded-xl text-white font-albulaBold transition-colors duration-300 ${
                                    answers.textResponse && answers.textTwo
                                        ? "bg-[#266666] hover:bg-[#609c9c]"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={!answers.textResponse && currentQuestion === 0}
                                className={`px-4 py-2 rounded-xl text-white ${
                                    answers.textResponse || answers.textTwo
                                        ? "bg-[#266666] hover:bg-[#609c9c]"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SentimentAnalysis;
