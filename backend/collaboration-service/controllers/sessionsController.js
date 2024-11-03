const SessionSchema = require('../models/Session');

const getSession = async (req, res) => {
    if (!(req.params.id)) {
        return res.status(400).json({ 'message': 'No session ID provided!' });
    }

    const session = await SessionSchema.findOne({ sessionid: req.params.id });

    return res.status(200).json(session)
}

const createSession = async (req, res) => {
    if (!(req.body.sessionid && req.body.userid1 && req.body.userid2 && req.body.username1 && req.body.username2)) {
        return res.status(400).json({ 'message': 'Not enough details provided!' });
    }
    if (await SessionSchema.countDocuments({ sessionid: req.body.sessionid }) > 0) {
        return res.status(400).json({ 'message': 'Session already exists!' })
    }
    try {
        const result = await SessionSchema.create({
            sessionid: req.body.sessionid,
            pastAttempts: [],
            users: [
                {
                    userId: req.body.userid1,
                    username: req.body.username1
                },
                {
                    userId: req.body.userid2,
                    username: req.body.username2
                }
            ],
            codeWindows: {
                python: req.body.codeWindows.python,
                java: req.body.codeWindows.java,
                javascript: req.body.codeWindows.javascript
            }
        });
        
        console.log(`Session ${req.body.id} data created in the database.`)
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateSession = async (req, res) => {
    try {
        if (!(req.body?.sessionid)) {
            return res.status(400).json({ 'message': 'Not enough details provided!' });
        }
        const session = await SessionSchema.findOne({ sessionid: req.body.sessionid }).exec()
        if (req.body?.language && req.body?.code) {
            console.log(`Updating code for language: ${req.body.language}.`);
            if (req.body.language === 'python') {
                session.codeWindows.python = req.body.code;
            } else if (req.body.language === 'java') {
                session.codeWindows.java = req.body.code;
            } else if (req.body.language === 'javascript') {
                session.codeWindows.javascript = req.body.code;
            };
        };

        if (req.body?.newAttempt?.language && req.body?.newAttempt?.content && req.body?.newAttempt?.testCases) {
            console.log(`Adding new attempt`);
            session.pastAttempts.push({
                attemptNo: session.pastAttempts.length + 1,
                language: req.body.newAttempt.language,
                content: req.body.newAttempt.content,
                testCases: req.body.newAttempt.testCases
            });
        };

        const updatedSession = await session.save();
        return res.status(200).json(updatedSession);
    } catch (err) {
        console.error('Error updating session:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteSession = async (req, res) => {
    const sessionid = req.body?.sessionid;

    if (!sessionid) {
        return res.status(400).json({ 'message': 'Session ID is required!' });
    }

    const session = await SessionSchema.findOne({ sessionid: sessionid });

    if (!session) {
        return res.status(404).json({ 'message': 'Session not found!' });
    }

    const result = await session.deleteOne();
    return res.status(200).json({ 'message': `Session ${sessionid} data deleted.` });
}

const getWhiteboard = async (sessionid) => {

    if (!sessionid) {
        return [];
    }

    const session = await SessionSchema.findOne({ sessionid: sessionid });

    if (!session || !session.whiteboard) {
        return [];
    }
    return session.whiteboard;
}


const saveWhiteboard = async (sessionid, whiteboardData) => {
    if (!sessionid) {
        return false;
    }    

    const session = await SessionSchema.findOne({ sessionid: sessionid }).exec();
    
    if (whiteboardData) session.whiteboard.push(whiteboardData);
    const updatedSession = await session.save();
    return updatedSession;
}

const clearWhiteboard = async (sessionid) => {
    if (!sessionid) {
        return false;
    }    

    const session = await SessionSchema.findOne({ sessionid: sessionid }).exec();
    
    if (!session) {
        return false;
    }
    session.whiteboard = [];
    const updatedSession = await session.save();
    return updatedSession;
}



module.exports = {getSession, createSession, updateSession, deleteSession, getWhiteboard, saveWhiteboard, clearWhiteboard};