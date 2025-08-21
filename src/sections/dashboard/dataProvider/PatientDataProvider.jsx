import React, { createContext, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { useParams } from 'react-router-dom';

import PatientRegistration from '../../../build/contracts/PatientRegistration.json';
import MentalHealth from '../../../build/contracts/MentalHealth.json';

const PatientDataContext = createContext(null);

export const PatientDataProvider = ({ healthID, children }) => {
  const params = useParams();
  const effectiveHealthID = healthID || params.healthID || '';
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      console.log('PatientDataProvider init, healthID prop:', healthID, 'route param:', params.healthID, 'using:', effectiveHealthID);
      if (!effectiveHealthID) {
        setError('No healthID provided in route or props.');
        setLoading(false);
        return;
      }

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

            const patientCredentials = await patientContract.methods
              .getPatientCredentials(effectiveHealthID)
              .call();

            const patientPersonalDetails = await patientContract.methods
              .getPatientPersonalDetails(effectiveHealthID)
              .call();

            const patientContactDetails = await patientContract.methods
              .getPatientContactDetails(effectiveHealthID)
              .call();

            const patientMedicalDetails = await patientContract.methods
              .getPatientMedicalDetails(effectiveHealthID)
              .call();

            const patientLifeStyleDetails = await patientContract.methods
              .getPatientLifestyleDetails(effectiveHealthID)
              .call();

            const patientPolicyDetails = await patientContract.methods
              .getPatientPolicyDetails(effectiveHealthID)
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
              mentalHealthDetails: {
                testIDs: [],
                childhoodScores: [],
                PHQ9Scores: [],
                sentimentScores: [],
                finalScores: [],
              }
            });
          } else {
            setError('PatientRegistration smart contract not deployed on the detected network.');
          }

          const mentalHealthDeployedNetwork = MentalHealth.networks[networkId];

          if (mentalHealthDeployedNetwork) {
            const mentalHealthContract = new web3Instance.eth.Contract(
              MentalHealth.abi,
              mentalHealthDeployedNetwork.address
            );

            const fetchedTestIDs = await mentalHealthContract.methods
              .getAllTestIDs(effectiveHealthID)
              .call();

            let tempChildhoodScores = [];
            let tempPHQ9Scores = [];
            let tempSentimentScores = [];
            let tempFinalScores = [];

            for (const testID of fetchedTestIDs) {
              const fetchChildHoodScore = await mentalHealthContract.methods
                .getmhtcdscore(testID)
                .call();

              const fetchPHQ9Score = await mentalHealthContract.methods
                .getmhtphqscore(testID)
                .call();

              const fetchSentimentScore = await mentalHealthContract.methods
                .getSentimentScore(testID)
                .call();

              const finalScore = ((Number(fetchChildHoodScore) * 0.2) + (Number(fetchPHQ9Score) * 0.5) + (Number(fetchSentimentScore) * 0.3));

              tempChildhoodScores.push(Number(fetchChildHoodScore));
              tempPHQ9Scores.push(Number(fetchPHQ9Score));
              tempSentimentScores.push(Number(fetchSentimentScore));
              tempFinalScores.push(finalScore);
            }

            const mentalHealthDetails = {
              testIDs: fetchedTestIDs,
              childhoodScores: tempChildhoodScores,
              PHQ9Scores: tempPHQ9Scores,
              sentimentScores: tempSentimentScores,
              finalScores: tempFinalScores
            };

            setPatientDetails(prevDetails => ({
              ...prevDetails,
              mentalHealthDetails
            }));
          } else {
            setError('MentalHealth smart contract not deployed on the detected network.');
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

    if (healthID) init();
  }, [healthID]);

  return (
    <PatientDataContext.Provider value={{ patientDetails, loading, error }}>
      {children}
    </PatientDataContext.Provider>
  );
};

export const usePatientData = () => {
  const ctx = useContext(PatientDataContext);
  if (ctx === null) {
    throw new Error('usePatientData must be used within a PatientDataProvider');
  }
  return ctx;
};

export default PatientDataProvider;
