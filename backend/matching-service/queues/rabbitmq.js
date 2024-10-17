const amqp = require("amqplib/callback_api");
const { matchUsers, handleMatchRequest } = require("../service/matchingQueue");

const initRabbitMQ = () => {
  const connect = () => {
    amqp.connect(
      process.env.RABBITMQ_URI,
      function (error0, connection) {
        if (error0) {
          console.error(
            "RabbitMQ connection error, retrying in 5 second.",
            error0
          );
          setTimeout(connect, 5000);
          return;
        }
        matchUsers();
      }
    );
  };

  connect();
};

module.exports = { initRabbitMQ };
