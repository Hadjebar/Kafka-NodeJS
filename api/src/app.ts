
import express from 'express';
import { Kafka, logLevel } from 'kafkajs';
import routes from './routes';

const app = express();

const kafka = new Kafka({
    clientId: 'api',
    brokers: ['localhost:9092'],
    ssl: true,
    logLevel: logLevel.WARN,
    retry: {
      initialRetryTime: 300,
      retries: 10
    },
});

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'auth-group-receiver' })

app.use((req, res, next) => {
    req.producer = producer;  
    return next();
})

app.use(routes);

async function run() {
  await producer.connect()
  await consumer.connect()

  await consumer.subscribe({ topic: 'auth-response' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Response ---> ', String(message.value));
    },
  });

  app.listen(3000);
}

run().catch(console.error)