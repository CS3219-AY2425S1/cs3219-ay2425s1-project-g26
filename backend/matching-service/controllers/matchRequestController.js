const MatchingQueue = require('../service/matchingQueue')
const MatchController = require('../controllers/matchController')
const axios = require('axios');

const createMatchRequest = async (req, res) => {
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
            sessionId: matchedResult.sessionId
        };

        if (matchedResult.matched) {

            const usernames = await getUsername(matchedResult.user1, matchedResult.user2);
            
            const user1Name = usernames[0];
            const user2Name = usernames[1];

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
        }
        // Return the result as 201 even if not matched.
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
            return res.status(400).json({ 'message': 'Error fetching username!' });
        }

        const data = response.data.data;
        const user1Name = data.filter(user => user.id == user1Id)[0].username;
        const user2Name = data.filter(user => user.id == user2Id)[0].username;
        return [user1Name, user2Name];

    } catch (error) {
        console.log("ERROR", error);
        console.log(`${error.status}: ${error.response}`);
        return res.status(400).json({ 'message': 'Matched users not found!' });
    }
 }

module.exports = { createMatchRequest, cancelMatchRequest };