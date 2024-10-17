const MatchingQueue = require('../service/matchingQueue')
const MatchController = require('../matchController')
const { request } = require('express')

const createMatchRequest = async (req, res) => {
    if (!(req.body.id && req.body.difficulty && req.body.category)) {
        return res.status(400).json({ 'message' : 'At least one field is missing!'})
    }

    // Format required fields appropriately
    request = { id: req.body.id,
                difficulty: req.body.difficulty,
                category: req.body.category
    }

    matchingResult = MatchingQueue.handleMatchRequest(request)

    if (matchingResult.matched) {
        MatchController.createMatch(matchingResult)
        return res.status(201).json(matchingResult)
    } else {
        return res.status(404).json(matchingResult)
    }
}

const cancelMatchRequest = async (req, res) => {
    if (!(req.body.id && req.body.difficulty && req.body.category)) {
        return res.status(400).json({ 'message' : 'At least one field is missing!'})
    }

    // Format required fields appropriately
    request = { id: req.body.id,
        difficulty: req.body.difficulty,
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