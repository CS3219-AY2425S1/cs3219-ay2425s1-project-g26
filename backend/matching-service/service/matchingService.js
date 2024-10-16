const { getChannel } = require('../queues/rabbitmq');
const Match = require('../models/Match');

let requestQueue = {};  // In-memory storage for match requests by category

// Listen for match requests and process them
const listenForMatchRequests = () => {
  const channel = getChannel();
  if (!channel) return;

  const requestQueueName = 'match_request_queue';

  channel.consume(requestQueueName, (msg) => {
    const matchRequest = JSON.parse(msg.content.toString());
    const { userId, category, complexity } = matchRequest;

    // Handle the match request
    handleMatchRequest(userId, category, complexity);
  }, { noAck: true });
};

// Matching logic using an in-memory queue
const handleMatchRequest = (userId, category, complexity) => {
  console.log(`Handling match request for ${userId} in category ${category} with complexity ${complexity}`);

  if (!requestQueue[category]) requestQueue[category] = [];

    const complexityLevels = {
        "easy": 1,
        "medium": 2,
        "hard": 3
    };

  // Attempt to find a match based on category and difficulty
  let potentialMatch = requestQueue[category].find(req => {

      const userComplexityLevel = complexityLevels[complexity];
      const reqComplexityLevel = complexityLevels[req.complexity];

      // Check if the complexities match or if they are one level apart
      return Math.abs(reqComplexityLevel - userComplexityLevel) <= 1;

  });


  if (potentialMatch) {
    // Create a new match

    const selectedComplexity = (complexityLevels[potentialMatch.complexity] < complexityLevels[complexity])
                ? potentialMatch.complexity
                : complexity;

    const match = new Match({
      user1Id: potentialMatch.userId,
      user2Id: userId,
      category: category,
      complexity: selectedComplexity,
      isSuccess: true
    });
    match.save();

    // Notify both users of the successful match
    notifyUsersOfMatch(potentialMatch.userId, userId);

    // Remove the matched user from the queue
    requestQueue[category] = requestQueue[category].filter(req => req.userId !== potentialMatch.userId);
  } else {
    // Add to request queue if no match found
    requestQueue[category].push({ userId, category, complexity, timestamp: Date.now() });

    // Set a timeout to notify the user after 30 seconds if no match is found
    setTimeout(() => {
      const currentRequest = requestQueue[category].find(req => req.userId === userId);
      if (currentRequest) {
        notifyNoMatchFound(userId);
        requestQueue[category] = requestQueue[category].filter(req => req.userId !== userId);
      }
    }, 30000);  // 30 seconds
  }
};

// Notify users of a successful match
const notifyUsersOfMatch = (user1Id, user2Id) => {
  const channel = getChannel();
  const replyQueueName = 'match_reply_queue';

  channel.sendToQueue(replyQueueName, Buffer.from(JSON.stringify({ user1Id, user2Id })));
};

// Notify user if no match is found within 30 seconds
const notifyNoMatchFound = (userId) => {
  const channel = getChannel();
  const replyQueueName = 'match_reply_queue';

  channel.sendToQueue(replyQueueName, Buffer.from(JSON.stringify({ userId, message: "No match found within 30 seconds." })));
};

// Export the service functions
module.exports = { listenForMatchRequests, handleMatchRequest };
