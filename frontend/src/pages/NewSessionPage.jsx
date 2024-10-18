import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../AuthContext";
import withAuth from "../hoc/withAuth"; 
import loading from "../assets/loading.svg";
import Cookies from 'js-cookie'; 
import "./styles/NewSessionPage.css";

const NewSessionPage = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [topicsArray, setTopicsArray] = useState([]);
  const [targetTopicsArray, setTargetTopicsArray] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');

  const getHeaders = () => {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    };
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:8080/questions", {
          method: "GET",
          headers: getHeaders(),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        getTopics(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
  
    fetchQuestions();
  }, []);

  const getTopics = (questions) => {
    const topicCount = {
      Easy: {},
      Medium: {},
      Hard: {}
    };

    questions.forEach(qn => {
      const topicArr = qn.category;
      const difficulty = qn.complexity;

      topicArr.forEach(tp => {
        if (topicCount[difficulty][tp]) {
            topicCount[difficulty][tp]++;
        } else {
            topicCount[difficulty][tp] = 1;
        }
      });
    });

    const easyTopics = Object.keys(topicCount['Easy']).map(topic => ({
      name: topic,
      count: topicCount['Easy'][topic]
    }));

    const medTopics = Object.keys(topicCount['Medium']).map(topic => ({
      name: topic,
      count: topicCount['Medium'][topic]
    }));

    const hardTopics = Object.keys(topicCount['Hard']).map(topic => ({
        name: topic,
        count: topicCount['Hard'][topic]
    }));

    easyTopics.sort((a, b) => a.name.localeCompare(b.name));
    medTopics.sort((a, b) => a.name.localeCompare(b.name));
    hardTopics.sort((a, b) => a.name.localeCompare(b.name));

    setTopicsArray({
        easy: easyTopics,
        medium: medTopics,
        hard: hardTopics
    });
  };

  const handleDifficultyChange = (e) => {
    setTargetTopicsArray(topicsArray[e.target.value]);
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formObj = Object.fromEntries(formData.entries());

    if (formObj.hasOwnProperty('difficulty') && formObj.hasOwnProperty('topic')) {
        const userId = Cookies.get('userId'); 
        const { difficulty, topic } = formObj;

        const payload = {
            id: userId, // user ID from cookies
            difficulty: difficulty, // selected difficulty
            category: topic // selected topic
        };

        const apiUrl = 'http://localhost:8082/matches/'; // maybe this is wrong

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` // remove if don't need bearer access token in header 
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to add to queue');
            }

            // if successful, navigate to the waiting page
            navigate('/waiting', { state: { userPref: formObj } });
        } catch (error) {
            console.error('Error submitting data:', error);
            alert(`I just tried to send a POST API call to ${apiUrl}, with this JSON raw values ${JSON.stringify(payload)}, and I failed.`);
        }
    } else {
        alert('Select a difficulty/topic');
    }
  };


  return (
    <div className="session-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>Back</button>
        <div className="session-selection">
            <p>Start a New Session</p>
            <form className="session-form" onSubmit={handleSubmit}>
                <div className="difficulty-selection">
                    <p>Select a Difficulty Level:</p>
                    <div className="options">
                      <input type="radio" id="easy" name="difficulty" value="easy" onChange={handleDifficultyChange} />
                      <label className="radio-label" htmlFor="easy">Easy</label>
                      <input type="radio" id="medium" name="difficulty" value="medium" onChange={handleDifficultyChange} />
                      <label className="radio-label" htmlFor="medium">Medium</label>
                      <input type="radio" id="hard" name="difficulty" value="hard" onChange={handleDifficultyChange} />
                      <label className="radio-label" htmlFor="hard">Hard</label>
                    </div>
                </div>
                <div className={`topic-selection ${targetTopicsArray.length === 0 ? '' : 'section-shown'}`}>
                    <p>Select a Topic:</p>
                    <div className="options">
                      {
                        targetTopicsArray.length === 0 ? (
                          <img src={loading} alt="Loading..." />
                        ) : (
                          targetTopicsArray.map((topic) => (
                            <React.Fragment key={topic.name}>
                              <input
                                type="radio"
                                id={topic.name}
                                name="topic"
                                value={topic.name}
                                onChange={handleTopicChange}
                              />
                              <label className="radio-label" htmlFor={topic.name}>
                                {`${topic.name} (${topic.count})`}
                              </label>
                            </React.Fragment>
                          ))
                        )
                      }
                    </div>
                </div>
                <button className={`start-btn ${selectedTopic === '' ? '' : 'show-btn'}`}>Start Matching</button>
            </form>
        </div>
    </div>
  );
};

const WrappedNewSessionPage = withAuth(NewSessionPage);
export default WrappedNewSessionPage;
