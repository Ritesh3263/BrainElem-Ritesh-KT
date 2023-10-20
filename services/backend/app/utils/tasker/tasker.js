var amqp = require('amqplib/callback_api');

exports.addTask = async (data, queue, callback) => {
  //Preprocess tasks
  connect(data, queue, callback)
}



const connect = async (data, queue, callback) => {
  //console.log("CONNECTING TO MESSAGE_BROKER ON", queue)
  amqp.connect(`amqp://${process.env.MESSAGE_BROKER_DEFAULT_USER}:${process.env.MESSAGE_BROKER_DEFAULT_PASS}@${process.env.MESSAGE_BROKER_HOST}`, {timeout: 5000}, function(err0, connection) {
    //console.log("CONNECTED TO MESSAGE_BROKER ON", queue)
    if (err0 !== null) {
      console.error('Error when connecting to message-broker', err0)
      callback(err0);
    }
    else {
      
      connection.createConfirmChannel(async function(err1, ch){
        if (err1 !== null){
          console.error('Error when confirming channel for message-broker', err1)
          callback(err1);
        }
        else{
          //console.log("CALLING assertQueue")
          await ch.assertQueue(queue, {
            durable: true
          });


          //console.log("CALLING sendToQueue")
          ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {persistent: true}, function(err2) {
            if (err2 !== null){
              console.error('Error when sending message to message-broker', err2) 
              callback(err2);

            }
            else{
              connection.close();
              console.log("-> Message '%s' was sent to message-broker (%s)", JSON.stringify(data.task), queue);
              callback()
            }
          });
       }
      });
    }
  });
}

