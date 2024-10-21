import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../AuthContext";
import withAuth from "../hoc/withAuth"; 
import loading from "../assets/loading.svg";
import "./styles/NewSessionPage.css";

const NewSessionPage = () => {
  const { accessToken, userId } = useAuth();
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
        Easy: easyTopics,
        Medium: medTopics,
        Hard: hardTopics
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
    const formObj = {};

    formData.forEach((value, key) => {
      if (key === 'category') {
          if (!formObj[key]) {
              formObj[key] = [];
          }
          formObj[key].push(value);
      } else {
          formObj[key] = value;
      }
  });

    const userPref = {
      id: userId,
      complexity: formObj.complexity,
      category: formObj.category
    };

    if (userPref.hasOwnProperty('complexity') && userPref.hasOwnProperty('category')) {
      navigate('/waiting', { state: { userPref } });
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
                      <input type="radio" id="Easy" name="complexity" value="Easy" onChange={handleDifficultyChange} />
                      <label className="radio-label" htmlFor="Easy">Easy</label>
                      <input type="radio" id="Medium" name="complexity" value="Medium" onChange={handleDifficultyChange} />
                      <label className="radio-label" htmlFor="Medium">Medium</label>
                      <input type="radio" id="Hard" name="complexity" value="Hard" onChange={handleDifficultyChange} />
                      <label className="radio-label" htmlFor="Hard">Hard</label>
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
                                type="checkbox"
                                id={topic.name}
                                name="category"
                                value={topic.name}
                                onChange={handleTopicChange}
                              />
                              <label className="check-label" htmlFor={topic.name}>
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

