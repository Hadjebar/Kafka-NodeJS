import express from 'express';
import { CompressionTypes } from 'kafkajs';

const routes = express.Router(); 

routes.post('/auth', async (req, res) => {

  const message = {
    key: 'cleee 8',
    user: { id: 1, name: 'Yanis Kichouuu' },
    course: 'Kafka NodeJs',
    grade: 10,
  };

  const response = await req.producer.send({
    topic: 'auth-NearBy',
    compression: CompressionTypes.GZIP,
    messages: [
      { value: JSON.stringify(message) },
    ],
  });

  



  return res.json({ data: response });
});

export default routes;
