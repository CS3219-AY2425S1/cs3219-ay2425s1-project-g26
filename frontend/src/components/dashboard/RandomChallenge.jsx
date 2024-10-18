import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RandomChallenge = () => {
  const navigate = useNavigate();
  const [randomChallenge, setRandomChallenge] = useState({ difficulty: '', topic: '' });
  const [topicsArray, setTopicsArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const difficulties = ["Easy", "Medium", "Hard"];
  
  const accessToken = localStorage.getItem('accessToken');

  const getHeaders = () => {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    };
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!accessToken) {
        console.error("Access token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/questions", {
          method: "GET",
          headers: getHeaders(),
        });

        if (!response.ok) {
          const errorBody = await response.json();
          console.error("Error fetching questions:", errorBody);
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        getTopics(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [accessToken]);

  const getTopics = (questions) => {
    const topicCount = {};

    questions.forEach(qn => {
      const topicArr = qn.category;

      topicArr.forEach(tp => {
        if (topicCount[tp]) {
          topicCount[tp]++;
        } else {
          topicCount[tp] = 1;
        }
      });
    });

    const topics = Object.keys(topicCount).map(topic => ({
      name: topic,
      count: topicCount[topic]
    }));

    topics.sort((a, b) => a.name.localeCompare(b.name));
    setTopicsArray(topics);
  };

  useEffect(() => {
    const generateRandomChallenge = () => {
      if (topicsArray.length > 0) {
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        const randomTopic = topicsArray[Math.floor(Math.random() * topicsArray.length)].name; 
        setRandomChallenge({ difficulty: randomDifficulty, topic: randomTopic });
      }
    };

    generateRandomChallenge();
  }, [topicsArray]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        borderRadius: "10px",
        backgroundColor: "#fff",
        padding: "20px",
        width: "400px",
        height: "200px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginTop: "40px",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px'
      }}
    >
      <h2 style={{ margin: "0 0 10px 0" }}>Random Coding Challenge</h2>
      <p style={{ margin: "0", color: "#333", textAlign: 'center' }}>
        <strong>Difficulty:</strong> {randomChallenge.difficulty || "N/A"}
      </p>
      <p style={{ margin: "0", color: "#333", textAlign: 'center' }}>
        <strong>Topic:</strong> {randomChallenge.topic || "N/A"}
      </p>
      <button
        onClick={() => navigate('/new-session')}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#2a4b5e'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#1a3042'}
        style={{
          marginTop: "20px",
          padding: "15px 30px",
          backgroundColor: '#1a3042',
          color: "#fff",
          border: "none",
          borderRadius: "15px",
          cursor: "pointer",
          fontSize: '16px',
          fontFamily: 'Figtree',
          transition: "background-color 0.3s",
        }}
      >
        Try Challenge
      </button>
    </div>
  );
};

export default RandomChallenge;
