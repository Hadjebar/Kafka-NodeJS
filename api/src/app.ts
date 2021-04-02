
import express from 'express';
import { Kafka, logLevel } from 'kafkajs';

import routes from './routes';

const app = express();

const kafka = new Kafka({
    clientId: 'api',
    brokers: ['localhost:9092'],
    ssl: false,
    retry: {
      initialRetryTime: 300,
      retries: 10
    },
});

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'auth-group-recevier' })

var results = [];

app.use((req, res, next) => {
    req.producer = producer;  
    results.push(res);
    return next();
})

app.use(routes);
// pkill -f node

async function run() {
  await producer.connect()
  await consumer.connect()

  await consumer.subscribe({ topic: 'auth-response' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Response ---> ', String(message.value));
      results[0].json({ data:  String(message.value) });
    },
  });

  app.listen(3336, () => {
    console.log(`
      #######################################
      🛡️  Server listening on port: 3336 🛡️
      #######################################
    `);
  }).on('error', err => {
    process.exit(1);
  });
}


run().catch(console.error)