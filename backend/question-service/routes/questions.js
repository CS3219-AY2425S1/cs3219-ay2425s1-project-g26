const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');
const { verifyAdmin, verifyUser } = require('../middleware/verification');

router.get('/', verifyUser, questionsController.getAllQuestions)
router.post('/', verifyAdmin, questionsController.createQuestion)
router.put('/:id', verifyAdmin, questionsController.updateQuestion)
router.delete('/:id', verifyAdmin, questionsController.deleteQuestion)

// Get question based on id
router.get('/:id', verifyUser, questionsController.getQuestion);

module.exports = router;