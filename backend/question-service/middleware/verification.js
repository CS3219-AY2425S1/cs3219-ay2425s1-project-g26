const axios = require('axios');

const verifyAdmin = async (req, res, next) => {
    // Require access token
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const accessToken = authHeader.split(" ")[1];
    
    try {
        // Make a GET request to user-service with the token
        const response = await axios.get('http://localhost:8081/auth/verify-token', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response) {
            return res.status(error.status).json({ error: `${error.response.data.message}` });
        } 

        if (response.data.data.isAdmin) {
            next();
        } else {
            return res.status(403).json({ error: `User is not admin.` });
        }

    } catch (error) {
        console.log(`${error.status}: ${error.response.data.message}`);
        return res.status(error.status).json({ error: `${error.response.data.message}` });
    }
}

const verifyUser = async (req, res, next) => {
    // Require access token
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const accessToken = authHeader.split(" ")[1];
    
    try {
        // Make a GET request to user-service with the token
        const response = await axios.get('http://localhost:8081/auth/verify-token', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response) {
            return res.status(error.status).json({ error: `${error.response.data.message}` });
        } 
        next();

    } catch (error) {
        console.log(`${error.status}: ${error.response.data.message}`);
        return res.status(error.status).json({ error: `${error.response.data.message}` });
    }
}

module.exports = { verifyAdmin, verifyUser };
