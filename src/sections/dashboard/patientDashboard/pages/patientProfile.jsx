import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PatientRegistration from '../../../../build/contracts/PatientRegistration.json';
import Web3 from 'web3';

function PatientProfile() {
    const { healthID } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [patientDetails, setPatientDetails] = useState(null);
    
    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
    
                    const networkId = await web3Instance.eth.net.getId();
                    const patientDeployedNetwork = PatientRegistration.networks[networkId];
    
                    if (patientDeployedNetwork) {
                        const patientContract = new web3Instance.eth.Contract(
                            PatientRegistration.abi,
                            patientDeployedNetwork.address
                        );
    
                        // Fetch all patient data
                        const patientCredentials = await patientContract.methods
                            .getPatientCredentials(healthID)
                            .call();
    
                        const patientPersonalDetails = await patientContract.methods
                            .getPatientPersonalDetails(healthID)
                            .call();
    
                        const patientContactDetails = await patientContract.methods
                            .getPatientContactDetails(healthID)
                            .call();
    
                        const patientMedicalDetails = await patientContract.methods
                            .getPatientMedicalDetails(healthID)
                            .call();
    
                        const patientLifeStyleDetails = await patientContract.methods
                            .getPatientLifestyleDetails(healthID)
                            .call();
    
                        const patientPolicyDetails = await patientContract.methods
                            .getPatientPolicyDetails(healthID)
                            .call();
    
                        setPatientDetails({
                            credentials: {
                                walletAddress: patientCredentials[0],
                                name: String(patientCredentials[1]),
                                healthID: String(patientCredentials[2]),
                                email: String(patientCredentials[3]),
                            },
                            personalDetails: {
                                gender: String(patientPersonalDetails[0]),
                                age: String(patientPersonalDetails[1]),
                                date: String(patientPersonalDetails[2]),
                                month: String(patientPersonalDetails[3]),
                                year: String(patientPersonalDetails[4]),
                                maritalStatus: String(patientPersonalDetails[5]),
                                disabilities: String(patientPersonalDetails[6]),
                            },
                            contactDetails: {
                                contactNumber: String(patientContactDetails[0]),
                                apartmentNumber: String(patientContactDetails[1]),
                                street: String(patientContactDetails[2]),
                                city: String(patientContactDetails[3]),
                                state: String(patientContactDetails[4]),
                                country: String(patientContactDetails[5]),
                            },
                            medicalDetails: {
                                weight: String(patientMedicalDetails[0]),
                                feet: String(patientMedicalDetails[1]),
                                inches: String(patientMedicalDetails[2]),
                                allergies: String(patientMedicalDetails[3]),
                                isDiabetic: patientMedicalDetails[4],
                                isHypertension: patientMedicalDetails[5],
                            },
                            lifeStyleDetails: {
                                smokingStatus: String(patientLifeStyleDetails[0]),
                                alcoholConsumption: String(patientLifeStyleDetails[1]),
                                exerciseHabit: String(patientLifeStyleDetails[2]),
                            },
                            policyDetails: {
                                insuranceProvider: String(patientPolicyDetails[0]),
                                policyNumber: String(patientPolicyDetails[1]),
                            },
                        });
                    } else {
                        setError('PatientRegistration smart contract not deployed on the detected network.');
                    }
                } catch (err) {
                    console.error(err);
                    setError('Error accessing MetaMask or fetching data.');
                }
            } else {
                setError('MetaMask not detected. Please install the MetaMask extension.');
            }
            setLoading(false);
        };
    
        init();
    }, [healthID]);
    
    // Function to calculate health status based on medical and lifestyle details
    const calculateHealthStatus = () => {
        if (!patientDetails) return { percentage: 0, status: 'Unknown' };
        
        let score = 0;
        const maxScore = 5;
        
        // Simple scoring based on available data
        if (!patientDetails.medicalDetails.isDiabetic) score += 1;
        if (!patientDetails.medicalDetails.isHypertension) score += 1;
        if (patientDetails.lifeStyleDetails.smokingStatus === 'Non-smoker') score += 1;
        if (patientDetails.lifeStyleDetails.alcoholConsumption === 'Rarely' || 
            patientDetails.lifeStyleDetails.alcoholConsumption === 'Never') score += 1;
        if (patientDetails.lifeStyleDetails.exerciseHabit === 'Regular' || 
            patientDetails.lifeStyleDetails.exerciseHabit === 'Daily') score += 1;
        
        const percentage = Math.round((score / maxScore) * 100);
        return { percentage, status: 'Good' };
    };

    // Add BMI calculator function
    const calculateBMI = () => {
        const weight = parseFloat(patientDetails.medicalDetails.weight);
        const heightInFeet = parseFloat(patientDetails.medicalDetails.feet);
        const heightInInches = parseFloat(patientDetails.medicalDetails.inches);
        
        // Convert height to meters
        const heightInMeters = ((heightInFeet * 12) + heightInInches) * 0.0254;
        
        const bmi = weight / (heightInMeters * heightInMeters);
        return bmi.toFixed(1);
    };

    // Add BMI category function
    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return { category: 'Underweight', color: 'text-yellow-600' };
        if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
        if (bmi < 30) return { category: 'Overweight', color: 'text-orange-600' };
        return { category: 'Obese', color: 'text-red-600' };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="text-red-500 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-semibold mb-2">Error</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }
    
    const healthStatus = calculateHealthStatus();

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="mx-auto">
                <h1 className='font-googleSansBold text-4xl'>Profile</h1>
            </div>
        </div>
    );
}

export default PatientProfile;