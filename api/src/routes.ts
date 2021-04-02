import express from 'express';
import { CompressionTypes } from 'kafkajs';

const routes = express.Router();

routes.post('/auth', async (req, res) => {
  const message = {
    user: { id: 1, name: 'Yanis Kichouuu' },
    course: 'Kafka NodeJs',
    grade: 10,
  };

  await req.producer.send({
    topic: 'auth-NearBy',
    compression: CompressionTypes.GZIP,
    messages: [
      { value: JSON.stringify(message) },
      { value: JSON.stringify({ ...message, user: { ...message.user, name: 'Yanis' } }) },
    ],
  })

  return res.json({ ok: true });
});

export default routes;
