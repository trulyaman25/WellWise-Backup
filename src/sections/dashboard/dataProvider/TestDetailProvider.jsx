import React, { createContext, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import MentalHealth from '../../../build/contracts/MentalHealth.json';

const TestDetailContext = createContext(null);

export const TestDetailProvider = ({ testID, children }) => {
  const [scores, setScores] = useState(null);
  const [childHoodDetails, setChildHoodDetails] = useState(null);
  const [phq9Details, setphq9Details] = useState(null);
  const [sentimentalDetails, setSentimentalDetails] = useState(null);
  const [emotionDetails, setEmotionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (!window.ethereum) {
        setError('MetaMask not detected. Please install the MetaMask extension.');
        setLoading(false);
        return;
      }

      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        const networkId = await web3Instance.eth.net.getId();

        const mentalHealthContract = new web3Instance.eth.Contract(
          MentalHealth.abi,
          MentalHealth.networks[networkId]?.address
        );

        const fetchedAllScores = await mentalHealthContract.methods
          .getAllScores(testID)
          .call();
        const fetchedChildhoodDetails = await mentalHealthContract.methods
          .getChildhoodDetails(testID)
          .call();
        const fetchedPHQ9Details = await mentalHealthContract.methods
          .getPHQ9Details(testID)
          .call();
        const fetchSentimentDetails = await mentalHealthContract.methods
          .getSentimentDetails(testID)
          .call();
        const fetctEmotionDetails = await mentalHealthContract.methods
          .getEmotionDetails(testID)
          .call();

        setScores({
          historyScore: fetchedAllScores[0],
          phq9Score: fetchedAllScores[1],
          sentimentalScore: fetchedAllScores[2],
          videoScore: fetchedAllScores[3],
        });

        setChildHoodDetails({
          question1: fetchedChildhoodDetails[0],
          question2: fetchedChildhoodDetails[1],
          question3: fetchedChildhoodDetails[2],
          question4: fetchedChildhoodDetails[3],
          question5: fetchedChildhoodDetails[4],
          question6: fetchedChildhoodDetails[5],
          question7: fetchedChildhoodDetails[6],
          score: fetchedChildhoodDetails[7]
        });

        setphq9Details(fetchedPHQ9Details);

        setEmotionDetails({
          blinkCount: fetctEmotionDetails[0],
          blinkPerMin: fetctEmotionDetails[1]
        });

        setSentimentalDetails({
          test1: fetchSentimentDetails[0],
          test2: fetchSentimentDetails[1],
          analysisText1: fetchSentimentDetails[2],
          analysisText2: fetchSentimentDetails[3],
          score: fetchSentimentDetails[4]
        });

        setError('');
      } catch (err) {
        console.error(err);
        setError('Error accessing MetaMask or fetching data.');
      }

      setLoading(false);
    };

    if (testID) init();
  }, [testID]);

  return (
    <TestDetailContext.Provider value={{ scores, childHoodDetails, phq9Details, sentimentalDetails, emotionDetails, loading, error }}>
      {children}
    </TestDetailContext.Provider>
  );
};

export const useTestDetail = () => {
  const ctx = useContext(TestDetailContext);
  if (ctx === null) throw new Error('useTestDetail must be used within a TestDetailProvider');
  return ctx;
};

export default TestDetailProvider;
