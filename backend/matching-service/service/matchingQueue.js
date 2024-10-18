const amqp = require('amqplib');

const reqCh = process.env.RABBITMQ_REQ_CH;
const resCh = process.env.RABBITMQ_RES_CH;

let requests = [];
let timeout = 30000;

const matchUsers = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();
    await channel.assertExchange(reqCh, 'fanout', { durable: false }); // A (fanout)
    await channel.assertExchange(resCh, 'topic', { durable: false }); // B (topic)

    const q = await channel.assertQueue('', { exclusive: true }) // Bind to A
    channel.bindQueue(q.queue, reqCh);


    //Waiting for user details to come in
    channel.consume(q.queue, msg => {

        //Matching logic is designed inefficiently for now to facilitate upgrades
        const newRequest = JSON.parse(msg.content.toString());

        // Check if user is already in requests
        if (requests.find(req => req.id === newRequest.id)) {
            console.log(`User ${newRequest.id} is already in the request queue.`);
            return; // Skip adding this request
        }

        let perfectMatches = requests.filter(function (req) {
            return calculateMatchScore(newRequest, req) >= 4
        });
        let closeMatches = requests.filter(function (req) {
            return calculateMatchScore(newRequest, req) >= 3
        });
        var matchedRequest = false

        if (perfectMatches.length == 0 && closeMatches.length == 0) {
            requests.push(newRequest);
        } else if (perfectMatches.length > 0) {
            matchedRequest = perfectMatches.pop()
        } else {
            matchedRequest = closeMatches.pop()
        }

        if (matchedRequest) {
            requests.splice(requests.indexOf(matchedRequest), 1)
            result = {
                matched: true,
                user1: newRequest.id,
                user2: matchedRequest.id,
                category: newRequest.category,
                complexity: newRequest.complexity
            };
            console.log(`Matched ${result.user1} and ${result.user2}`)
            result = JSON.stringify(result)
            channel.publish(resCh, newRequest.id, Buffer.from(JSON.stringify(result))); // B to D
            channel.publish(resCh, matchedRequest.id, Buffer.from(JSON.stringify(result)));
        };

        setTimeout(() => {
            if (handleDeleteRequest(newRequest)) {
                result = {
                    matched: false,
                    user1: newRequest.id,
                    user2: "",
                    category: "",
                    complexity: ""
                };
                channel.publish(resCh, newRequest.id, Buffer.from(JSON.stringify(result))); //B to D
                console.log(`${newRequest.id} timed out.`)
            }
        }, timeout)
    }, { noAck: true });

    console.log("Matching queues initalized.");
}

// Prototype function for possible implementation
const calculateMatchScore = (request1, request2) => {
    matchScore = 0;
    if (request1.category == request2.category) {
        matchScore += 2
    };
    const difficultyLevels = {
        "Easy": 1,
        "Medium": 2,
        "Hard": 3
    };
    const difficultyLevel1 = difficultyLevels[request1.complexity];
    const difficultyLevel2 = difficultyLevels[request2.complexity];
    if (Math.abs(difficultyLevel1 - difficultyLevel2) <= 1) {
        matchScore += 1
    }
    if (difficultyLevel1 == difficultyLevel2) {
        matchScore += 1
    }

    return matchScore
}


const handleMatchRequest = async (request) => {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();
    await channel.assertExchange(reqCh, 'fanout', { durable: false });  // C (fanout)
    await channel.assertExchange(resCh, 'topic', { durable: false });  // D (topic)

    const q = await channel.assertQueue('', { exclusive: true }) // Bind to D
    channel.bindQueue(q.queue, resCh, request.id);

    //Sending user details
    channel.publish(reqCh, '', Buffer.from(JSON.stringify(request))); // C to A
    console.log(`Sent user ${request.id} for matching.`);

    //Promise
    return new Promise((resolve, reject) => {
        let received = false;
        // Consume the result from the queue
        channel.consume(q.queue, msg => {
            console.log(`User ${request.id} ~ Result: ${msg.content.toString()}`);
            result = JSON.parse(msg.content.toString());
            connection.close();
            received = true;
            resolve(result);  // Resolve with result once received
        }, { noAck: true });

        // Timeout after 45 seconds if no response is received (failsafe).
        setTimeout(() => {
            if (!received) {
                console.log(`45 seconds timeout for matching user ${request.id}`);
                connection.close();
                resolve({
                    matched: false,
                    user1: "",
                    user2: "",
                    category: request.category,
                    complexity: request.complexity
                });
            }
        }, 45000);
    });

}

const handleDeleteRequest = (user) => {
    if (requests.filter(request => request.id == user.id).length != 0) {
        requests = requests.filter(request => request.id !== user.id);
        console.log(`Match request for user ${user.id} deleted.`)
        return true;
    }
    return false;
}

module.exports = { matchUsers, handleMatchRequest, handleDeleteRequest };