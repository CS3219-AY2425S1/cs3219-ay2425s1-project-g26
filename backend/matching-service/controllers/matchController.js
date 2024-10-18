const Match = require('../models/Match'); // Import the Match model

/* This function is discontinued due to not interfacing with the frontend. Replacement below will be called by matchRequestController
// Create a new match
const createMatch = async (req, res) => {
    const { user1Id, user2Id, category, complexity } = req.body;

    // Validate required fields
    if (!(user1Id && user2Id && category && complexity)) {
        return res.status(400).json({ message: 'All fields are required (user1Id, user2Id, category, complexity).' });
    }

    try {
        const result = await Match.create({
            user1Id: req.body.user1Id,
            user2Id: req.body.user2Id,
            category: req.body.category,
            complexity: req.body.complexity
        });

        return res.status(201).json(result);  // Return success response with the match data
    } catch (err) {
        return res.status(500).json({ message: 'Error creating match.', error: err.message });
    }
};*/

// Create a new match to be stored in the database
const createMatch = async (matchResult) => {
    try {
        const result = await Match.create({
            user1Id: matchResult.user1,
            user2Id: matchResult.user2,
            category: matchResult.category,
            complexity: matchResult.complexity
        });
        console.log(`Matching data saved for ${matchResult.user1} and ${matchResult.user2}.`);
        return result
    } catch (err) {
        console.log("error:", err);
        return result
    }
}

// Retrieve a single match by its ID
const getMatchById = async (req, res) => {
    const id = req.params.id;

    try {
        const matches = await Match.find();

        filteredMatches = matches.filter(match => match.user1Id == id || match.user2Id == id);
        if (filteredMatches.length == 0) {
            return res.status(204).json(filteredMatches);
        }

        return res.status(200).json(filteredMatches);

    } catch (err) {
        return res.status(500).json({ message: 'Error retrieving match.', error: err.message });
    }
};

// Retrieve all matches (optional: filter by category, complexity, etc.)
const getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find();  // Retrieve all matches from the database

        if (matches.length === 0) {
            return res.status(204).json(matches);
        }

        return res.status(200).json(matches);
    } catch (err) {
        return res.status(500).json({ message: 'Error retrieving matches.', error: err.message });
    }
};

// Optionally delete a match by ID
const deleteMatchById = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedMatch = await Match.findByIdAndDelete(id);

        if (!deletedMatch) {
            return res.status(404).json({ message: `No match found with ID: ${id}` });
        }

        return res.status(200).json({ message: 'Match deleted successfully.', deletedMatch });
    } catch (err) {
        return res.status(500).json({ message: 'Error deleting match.', error: err.message });
    }
};

// Export the controller functions
module.exports = {
    createMatch,
    getMatchById,
    getAllMatches,
    deleteMatchById
};
