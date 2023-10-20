#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
require('dotenv').config({path: '../../.env'});
const mongoose = require('mongoose');
const dbConfig = require("./config/db.config");
var sendMail = require('./tasks/send_mail')
var processResults = require('./tasks/process_results')
var extractTextFromFile = require('./tasks/extract_text_from_file')
var assignVorticalScore = require('./tasks/assign_vortical_score')
const cronJob = require("./cronjobs/index");

mongoose.Promise = global.Promise;

mongoose
  .connect(`mongodb://${dbConfig.USER}:${dbConfig.PASS}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    connectToMessageBroker()
    cronJob.run(); // It will run cron jobs
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

function connectToMessageBroker(attempts = 10) {
  console.error("Trying to connect to message-broker");
  amqp.connect(`amqp://${process.env.MESSAGE_BROKER_DEFAULT_USER}:${process.env.MESSAGE_BROKER_DEFAULT_PASS}@${process.env.MESSAGE_BROKER_HOST}`,  {timeout: 2000}, function(error0, connection) {  
  if (error0) {
      attempts--
      console.error("Could not connect to message-broker. Next attempt after 10s. Attempts left:", attempts);
      if (attempts > 0) setTimeout(function () { connectToMessageBroker(attempts); }, 10000);
      else throw error0;
    } else {
      console.error("Connected to message-broker");
      connection.createChannel(async function (error1, channel) {
        if (error1) throw error1;

        var queue = 'mails';
        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);
        console.log(`##### Waiting for messages from message-broker [ ${queue} ].`);
        channel.consume(queue, async function (msg) {
          data = JSON.parse(msg.content)
          console.log("-> Received %s from message-broker", data);
          if (data.task == "SEND_MAIL") {
            await sendMail(data.mailId)
            channel.ack(msg);



          }
        }, { noAck: false });

        queue = 'results';
        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);
        console.log(`##### Waiting for messages from message-broker [ ${queue} ].`);
        channel.consume(queue, async function (msg) {
          data = JSON.parse(msg.content)
          console.log("-> Received %s from message-broker", data);
          if (data.task == "PROCESS_RESULTS") {
            processResults(data.resultId, (err) => {
              if (!err) channel.ack(msg)
              else {
                console.log(err.message)
                if (!err.ack) setTimeout(function () { channel.reject(msg, true) }, 5000);
                else channel.ack(msg)
              }
            });
          }
        }, { noAck: false });

        queue = 'vortical';
        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);
        console.log(`##### Waiting for messages from message-broker [ ${queue} ].`);
        channel.consume(queue, async function (msg) {
          data = JSON.parse(msg.content)
          console.log("-> Received %s from message-broker (%s)", data);
          if (data.task == "ASSIGN_VORTICAL_SCORE") {
            assignVorticalScore(data.userId, data.contentsIds, (err) => {
              if (!err) channel.ack(msg)
              else {
                console.log(err.message)
                if (!err.ack) setTimeout(function () { channel.reject(msg, true) }, 5000);
                else channel.ack(msg)
              }
            });
          }
        }, { noAck: false });


        queue = 'text-extracting';
        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);
        console.log(`##### Waiting for messages from message-broker [ ${queue} ].`);
        channel.consume(queue, async function (msg) {
          data = JSON.parse(msg.content)
          console.log("-> Received %s from message-broker", data);
          if (data.task == "EXTRACT_TEXT_FROM_FILE") {
            extractTextFromFile(data.fileId, (err) => {
              if (!err) channel.ack(msg)
              else {
                console.log(err.message)
                if (!err.ack) setTimeout(function () { channel.reject(msg, true) }, 5000);
                else channel.ack(msg)
              }
            });
          }
        }, { noAck: false });

      });
    }
  });

}