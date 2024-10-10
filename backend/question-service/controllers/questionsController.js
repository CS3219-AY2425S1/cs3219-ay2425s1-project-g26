const QuestionSchema = require('../models/Question');


const getAllQuestions = async (req, res) => {
    const questions = await QuestionSchema.find();
    if (!questions) return res.status(204).json({ 'message': 'No questions found.' });
    res.json(questions);
}

const createQuestion = async (req, res) => {
    if (!(req?.body?.title && req?.body?.description && req?.body?.category && req?.body?.complexity)) {
        return res.status(400).json({ 'message': 'Title, description, category and complexity are required!' });
    }

    // Convert category to an array if it's a comma-separated string
    let categoryArray = req?.body?.category;
    if (typeof req?.body?.category === 'string') {
        categoryArray = req?.body?.category.split(',').map(item => item.trim()); // Convert string to array and trim spaces
    }

    // Check for duplicate questions by title and description
    if (await QuestionSchema.countDocuments({ title: req.body.title }) > 0) {
        return res.status(409).json({ 'message': 'A question with this title already exists!' })
    }
    if (await QuestionSchema.countDocuments({ description: req.body.description }) > 0) {
        return res.status(409).json({ 'message': 'A question with this description already exists!' })
    }
    try {
        const result = await QuestionSchema.create({
            title: req.body.title,
            description: req.body.description,
            category: categoryArray,
            complexity: req.body.complexity
        });
        
        console.log(`Question: ${req.body.title} created in the database.`)
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateQuestion = async (req, res) => {
  try {

    // to reflect the update successfully in database and UI, params.id / body._id can be used
    const questionId = req.body._id;
    console.log('Received questionId:', questionId);

    if (!questionId) {
        return res.status(400).json({ 'message': 'Question ID is required.' });
    }

    const question = await QuestionSchema.findOne({ _id: questionId }).exec();

    if (!question) {
        return res.status(401).json({ "message": `No question matches ID ${ questionId}.` });
    }

    // Check for duplicate titles
    const currentTitle = await QuestionSchema.findById(req.body._id, 'title').exec()
    const duplicateTitleCheck = (await QuestionSchema.countDocuments({ title: req.body.title }) > 1) || (await QuestionSchema.countDocuments({ title: req.body.title }) == 1 && currentTitle.title != req.body.title)
    if (duplicateTitleCheck) {
        return res.status(409).json({ 'message': 'A question with this title already exists!' })
    }

    // Check for duplicate descriptions
    const currentDescription = await QuestionSchema.findById(req.body._id, 'description').exec()
    const duplicateDescCheck = (await QuestionSchema.countDocuments({ description: req.body.description }) > 1) || (await QuestionSchema.countDocuments({ description: req.body.description }) == 1 && currentDescription.description != req.body.description)
    if (duplicateDescCheck) {
        return res.status(409).json({ 'message': 'A question with this description already exists!' })
    }

    // Convert category to an array if it's a comma-separated string
    let categoryArray = req?.body?.category;
    if (typeof req?.body?.category === 'string') {
        categoryArray = req?.body?.category.split(',').map(item => item.trim()); // Convert string to array and trim spaces
    }

    if (req.body?.title) question.title = req.body.title;
    if (req.body?.description) question.description = req.body.description;
    if (req.body?.category) question.category = categoryArray;
    if (req.body?.complexity) question.complexity = req.body.complexity;

    const updatedQuestion = await question.save();
    console.log(`Question: ${question.title} has been successfully updated in the database.`)

    return res.status(200).json(updatedQuestion);
  } catch (error) {
      console.error('Error updating question:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteQuestion = async (req, res) => {

    // to delete successfully in database and UI, params.id / body._id can be used
    const questionId = req.body._id;

    if (!questionId) return res.status(400).json({ 'message': 'Question ID is required.' });

    const question = await QuestionSchema.findOne({ _id: questionId }).exec();
    if (!question) {
        return res.status(204).json({ "message": `No question matches ID ${questionId}.` });
    }

    const result = await question.deleteOne();

    // return the new question list that no longer contain the deleted question
    const updatedQuestionList = await QuestionSchema.find();
    res.json(updatedQuestionList);
    console.log(`Question: ${question.title} has been successfully deleted in the database.`)
}

const getQuestion = async (req, res) => {
    if (!req?.params?._id) return res.status(400).json({ 'message': 'Question ID required.' });

    const question = await QuestionSchema.findOne({ _id: req.params._id }).exec();
    if (!question) {
        return res.status(204).json({ "message": `No question matches ID ${req.params._id}.` });
    }
    res.json(question);
}


module.exports = {
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestion
}