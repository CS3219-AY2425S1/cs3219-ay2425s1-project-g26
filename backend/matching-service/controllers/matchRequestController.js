const MatchingQueue = require('../service/matchingQueue')
const MatchController = require('../controllers/matchController')
const axios = require('axios');

const createMatchRequest = async (req, res) => {
    console.log("RECEIVED");
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const accessToken = authHeader.split(" ")[1];


    console.log("DED!");
    if (!(req.body.id)) {
        return res.status(400).json({ 'message': 'User ID is missing!' });
    }
    if (!(req.body.complexity)) {
        return res.status(400).json({ 'message': 'Complexity is not selected!' });
    }
    if (!(req.body.category)) {
        return res.status(400).json({ 'message': 'Category is not selected!' });
    }

    // Format required fields appropriately
    request = {
        id: req.body.id,
        complexity: req.body.complexity,
        category: req.body.category
    }

    await MatchingQueue.handleMatchRequest(request).then(async matchedResult => {
        let responseResult = {
            matched: matchedResult.matched,
            matchedUserId: "",
            matchedUserName: "",
            category: matchedResult.category,
            complexity: matchedResult.complexity,
            sessionId: matchedResult.sessionId,
            question: {},
        };

        if (matchedResult.matched) {

            const usernames = await getUsername(matchedResult.user1, matchedResult.user2);
            
            if (!usernames) {
                return res.status(400).json({message: "Error fetching usernames."});
            }

            console.log("HERE!");
            const question = await getQuestion(accessToken, matchedResult.category, matchedResult.complexity);

            if (!question) {
                console.log("FALSE!!")
                return res.status(400).json({message: "Error fetching the question."});
            }

            const user1Name = usernames[0];
            const user2Name = usernames[1];

            responseResult.question = question;


            if (req.body.id == matchedResult.user1) {
                //Only user1 save the data to the db
                MatchController.createMatch(matchedResult, user1Name, user2Name);
                responseResult.matchedUserId = matchedResult.user2;
                responseResult.matchedUserName = user2Name;
            } else {
                //User 2 just updates result
                responseResult.matchedUserId = matchedResult.user1;
                responseResult.matchedUserName = user1Name;
            }
            console.log("Response to", responseResult.matchedUserId, ":", JSON.stringify(responseResult));
        } else {
            console.log("Response to", matchedResult.user1, ":", JSON.stringify(responseResult));
        }
        
        return res.status(201).json(responseResult);

    }).catch(error => {
        console.log(`error`, error);
        return res.status(400).json({ 'message': 'Something went wrong during matching!' });
    });

}

const cancelMatchRequest = async (req, res) => {

    console.log(`Recieved cancel request for ${req.params.id}`);
    // Format required fields appropriately
    deleteResult = MatchingQueue.handleDeleteRequest({ id: req.params.id });
    if (deleteResult) {
        return res.status(200).json({ 'message': "Successfully cancelled matching request." });
    } else {
        return res.status(404).json({ 'message': "No matching reuqests found!" });
    }
}


 const getUsername = async (user1Id, user2Id) => {
    try {
        const response = await axios.get('http://user-service:8081/users/public');

        if (!response) {
            return false;
        }

        const data = response.data.data;
        const user1 = data.filter(user => user.id == user1Id);
        const user2 = data.filter(user => user.id == user2Id);      
        if (user1.length == 0 || user2.length == 0) {
            return false;
        }

        return [user1[0].username, user2[0].username];

    } catch (error) {
        console.log("ERROR", error);
        return false;
    }
 }

 const getQuestion = async (accessToken, category, complexity) => {
    const dataToSend = { category: category, complexity: complexity };
    try {
        const response = await axios.post('http://question-service:8080/questions/specific', dataToSend, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response) {
            return false;
        }

        console.log(response);
        const data = response.data;
        
        return data;

    } catch (error) {
        console.log("ERROR", error);
        return false;
    }
 }

module.exports = { createMatchRequest, cancelMatchRequest };