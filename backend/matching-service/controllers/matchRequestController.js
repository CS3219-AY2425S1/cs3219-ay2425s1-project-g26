const MatchingQueue = require('../service/matchingQueue')
const MatchController = require('../controllers/matchController')

const createMatchRequest = async (req, res) => {
    if (!(req.body.id)) {
        return res.status(400).json({ 'message' : 'User ID is missing!'});
    }
    if (!(req.body.complexity)) {
        return res.status(400).json({ 'message' : 'Complexity is not selected!'});
    }
    if (!(req.body.category)) {
        return res.status(400).json({ 'message' : 'Category is not selected!'});
    }

    // Format required fields appropriately
    request = { id: req.body.id,
                complexity: req.body.complexity,
                category: req.body.category
    }

    await MatchingQueue.handleMatchRequest(request).then(matchingResult => {
        if (matchingResult.matched) {
            MatchController.createMatch(matchingResult);
        }             
        // Return the result as 201 even if not matched.
        //MatchController.createMatch({user1: "1", user2: "2", category: ["HI"], complexity: "Easy"});
        return res.status(201).json(matchingResult);

    }).catch(error => {
        console.log(`error`, error);
        return res.status(400).json({ 'message' : 'Something went wrong during matching!'});
    });

}

const cancelMatchRequest = async (req, res) => {
    console.log('Received request body:', req.body);
    if (!(req.body.id && req.body.complexity && req.body.category)) {
        return res.status(400).json({ 'message' : 'At least one field is missing!'})
    }

    // Format required fields appropriately
    request = { id: req.body.id,
        complexity: req.body.complexity,
        category: req.body.category
    }

    deleteResult = MatchingQueue.handleDeleteRequest(request)
    if (deleteResult) {
        return res.status(200)
    } else {
        return res.status(404)
    }
}

module.exports = { createMatchRequest, cancelMatchRequest };