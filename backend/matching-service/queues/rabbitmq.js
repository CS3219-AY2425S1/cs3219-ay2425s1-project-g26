const amqp = require("amqplib/callback_api");

let channel = null;

const initRabbitMQ = () => {
  const connect = () => {
    amqp.connect(
      "amqp://guest:guest@rabbitmq:5672",
      function (error0, connection) {
        if (error0) {
          console.error(
            "RabbitMQ connection error, retrying in 1 second.",
            error0
          );
          setTimeout(connect, 1000); 
          return;
        }

        connection.createChannel(function (error1, ch) {
          if (error1) {
            console.error("Error creating RabbitMQ channel:", error1);
            return;
          }
          channel = ch;

          const requestQueue = "match_request_queue";
          const replyQueue = "match_reply_queue";

          channel.assertQueue(requestQueue, { durable: true });
          channel.assertQueue(replyQueue, { durable: true });

          console.log("RabbitMQ connected and queues are ready.");
        });
      }
    );
  };

  connect();
};

const getChannel = () => channel;

module.exports = { initRabbitMQ, getChannel };
