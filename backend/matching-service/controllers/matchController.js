const Match = require('../models/Match');

// Create a new match to be stored in the database
const createMatch = async (matchResult, user1Name, user2Name) => {
    try {
        const result = await Match.create({
            user1Id: matchResult.user1,
            user1Name: user1Name,
            user2Id: matchResult.user2,
            user2Name: user2Name,
            category: matchResult.category,
            complexity: matchResult.complexity,
            sessionId: matchResult.sessionId
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
        const matches = await Match.find();

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
