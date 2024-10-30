const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');
const { verifyAdmin, verifyUser } = require('../middleware/verification');

//Get question based on a selected list with .
router.post('/ids', verifyUser, questionsController.getQuestionsByID);

//Get question based on a category and complexity
router.post('/specific', verifyUser, questionsController.getQuestionOnMatch);

//Temporary Hack for sk (TODO/TOREMOVE). To change to only admin access.
router.patch('/', questionsController.addTestCase)

router.get('/', verifyUser, questionsController.getAllQuestions)
router.post('/', verifyAdmin, questionsController.createQuestion)
router.put('/:id', verifyAdmin, questionsController.updateQuestion)
router.delete('/:id', verifyAdmin, questionsController.deleteQuestion)

// Get question based on id
router.get('/:id', verifyUser, questionsController.getQuestion);



module.exports = router;