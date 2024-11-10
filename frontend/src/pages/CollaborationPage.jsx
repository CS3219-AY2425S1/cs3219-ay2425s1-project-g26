import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import withAuth from "../hoc/withAuth";
import { useAuth } from '../AuthContext';
import io from 'socket.io-client';
import Tabs from '../components/collaboration/Tabs';
import CodePanel from '../components/collaboration/CodePanel';
import ConfirmationModal from '../components/collaboration/ConfirmationModal';
import ConfirmationModal2 from '../components/collaboration/ConfirmationModal2';
import { Toaster, toast } from 'sonner';

const socket = io('http://localhost:8084');

const CollaborationPage = () => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { login, accessToken, userId } = useAuth();

  const location = useLocation();
  const { matchData } = location.state || { matchData: {} };
  const sessionId = matchData.sessionId;

  const [isOtherUserPrompted, setIsOtherUserPrompted] = useState(false);

  const updateElapsedTime = () => {
    const savedStartTime = localStorage.getItem('startTime');

    if (savedStartTime) {
      const startTime = parseInt(savedStartTime, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsed = currentTime - startTime;
      setSecondsElapsed(elapsed);
    }
  };

  useEffect(() => {
    const savedStartTime = localStorage.getItem('startTime');

    if (!savedStartTime) {
      const currentTime = Math.floor(Date.now() / 1000);
      localStorage.setItem('startTime', currentTime.toString());
    }

    updateElapsedTime();

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateElapsedTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleEndSession = () => {
    setShowModal(true);
    /*  Feature Disabled
    socket.emit('confirmEndSession', sessionId, secondsElapsed);
    */
  };

  const handleSendLeaveMessage = async () => {
    const leaveMessage = {
      userId: "system",
      username: "System",
      message: "Your partner has left the session.",
    };

    try {
      await axios.post(`http://localhost:8085/chats/${sessionId}`, leaveMessage);
      if (socket) {
        socket.emit("sendMessage", { sessionId, ...leaveMessage });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const findBestAttempt = (attempts) => {
    let bestAttempt;
    if (attempts.length < 1) {
      bestAttempt = {
        language: 'None',
        content: '',
        testCases: [],
      }
      return bestAttempt;
    } 
    let testCases = 0;
    let highestScore = 0;

    for (let i = 0; i < attempts.length; i++) {
      let score = 0;
      if (attempts[i].testCases.length == 0) {
        continue
      } else {
        testCases = attempts[i].testCases.length;
        score = attempts[i].testCases.filter(Boolean).length;
        if (score >= highestScore) {
          highestScore = score;
          bestAttempt = attempts[i];
        }
      }
    }
    if (testCases == 0) {
      bestAttempt = attempts[attempts.length - 1];
    }
    return bestAttempt
  };

  /*  Unused - replaced with better method
  const formatTimeTaken = () => {
    const hours = Math.floor(secondsElapsed / 3600);
    const minutes = Math.floor((secondsElapsed % 3600) / 60);
    const seconds = secondsElapsed % 60;

    if (hours > 0) {
      return `${hours}:${minutes}:${seconds}`;
    } else {
      return `${minutes}:${seconds}`;
    }
  }*/

  const handleConfirmEndSession = () => {
    console.log("Attempt to leave session.")
    setShowModal(false);
    endSessionAndNavigate(secondsElapsed);
    socket.emit('endSession', sessionId, secondsElapsed);
  };

  const handleCancelEndSession = () => {
    setShowModal(false);
  };

  /*  Disabled - feature disabled
  const handleUser2Response = (response) => {
    setIsOtherUserPrompted(false);
    if (response) {
      // Emit confirmation if other user agrees
      socket.emit('responseEndSession', sessionId, 'yes', secondsElapsed);
    } else {
      // Emit cancellation if other user disagrees
      socket.emit('responseEndSession', sessionId, 'no');
    }
  };*/

  /*  Disabled - feature disabled
  useEffect(() => {
    socket.on('confirmEndSession', (elapsedTime) => {
      
      if (!isOtherUserPrompted) {
        setIsOtherUserPrompted(true);
        setSecondsElapsed(elapsedTime);
      }
      toast.info('Your partner has left the session.', { autoClose: false }); // User has to close notification manually
    });

    
    socket.on('endSessionBoth', (elapsedTime) => {
      endSessionAndNavigate(elapsedTime);
    });

    
    socket.on('userContinues', () => {
      toast.info('Your partner has chosen to continue the session.', { duration: 10000 }); // display for 10s
    });

    return () => {
      socket.off('confirmEndSession');
      socket.off('endSessionBoth');
      socket.off('userContinues');
    };
  }, [sessionId, isOtherUserPrompted]);*/

  const endSessionAndNavigate = (elapsedTime) => {
    //     socket.emit('endSession', sessionId);
    const formattedElapsedTime = formatTime(elapsedTime);
    localStorage.removeItem('startTime');

    handleSendLeaveMessage()
    
    fetch(`http://localhost:8084/sessions/${sessionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => findBestAttempt(data.pastAttempts))
      .then((bestAttempt) => {
        const attemptDate = new Date(Date.now() - elapsedTime * 1000);

        return fetch(`http://localhost:8081/users/history/${userId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: matchData.question,
            partner: matchData.matchedUserName,
            startDateTime: attemptDate.toLocaleString('en-SG', {timeZone: 'Asia/Singapore'}),
            attempt: bestAttempt,
            timeTaken: formattedElapsedTime,
          }),
        });
      })
      .then(() => {
        if (localStorage.getItem('partnerLeft')) {
          try {
            fetch(`http://localhost:8084/sessions/${sessionId}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionid: sessionId }),
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          fetch(`http://localhost:8084/sessions/${sessionId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionid: sessionId, partnerLeft: true }),
          });
        }
        localStorage.removeItem('partnerLeft');
        navigate('/summary', { state: { matchData, secondsElapsed: elapsedTime } });
      })
      .catch((error) => console.error("Error ending session:", error));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', padding: '20px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
        Time Elapsed: {formatTime(secondsElapsed)}
      </div>
      <button
        onClick={handleEndSession}
        style={{ position: 'absolute', top: '20px', right: '20px', padding: '10px 20px', backgroundColor: '#fff', color: '#1a3042', border: '2px solid #1a3042', borderRadius: '15px', cursor: 'pointer' }}
      >
        Leave Session
      </button>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showModal}
        onConfirm={handleConfirmEndSession}
        onCancel={handleCancelEndSession}
      />
      
      {/* Other user's confirmation modal 
      <ConfirmationModal2
        show={isOtherUserPrompted}
        message="Your partner wants to end the session. Do you agree?"
        onConfirm={() => handleUser2Response(true)}
        onCancel={() => handleUser2Response(false)}
      />*/}

      {/* Main Content Section */}
      <div style={{ display: 'flex', flex: 1, flexDirection: 'row', gap: '20px', marginTop: '70px', width: '100%', height: '700px' }}>
        {/* Left Pane with Tabs */}
        <div style={{ flex: 1, padding: '6px' }}>
          <Tabs question={matchData.question} sessionId={sessionId} socket={socket} userId={userId} />
        </div>
        {/* Right Pane with Code Panel */}
        <div style={{ flex: 2, padding: '6px', overflow: 'hidden' }}>
          <CodePanel question={matchData.question} sessionId={sessionId} socket={socket} />
        </div>
      </div>
      <Toaster closeButton richColors position="top-center" />
    </div>
  );
};

const WrappedCollaborationPage = withAuth(CollaborationPage);
export default WrappedCollaborationPage;
