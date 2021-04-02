import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  brokers: ['localhost:9092'],
  clientId: 'auth',
})

const topic = 'auth-NearBy'
const consumer = kafka.consumer({ groupId: 'auth-group' })
const producer = kafka.producer();

async function run() {
  await consumer.connect()
  await consumer.subscribe({ topic })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
      console.log(`--------------------> ${prefix} ${message.key}#${message.value}`)

      const payload = JSON.parse(message.value.toString());

      // setTimeout(() => {

        var sendMessage = async () => {
          await producer.connect()
          await producer.send({
            topic: 'auth-response',
            messages: [
              { value: `auth de l'utilsateur ${payload.user.name} pour le module ${payload.course} !` }
            ]
          })
          await producer.disconnect()
        }
        
        sendMessage();
      
      
    },
  })
}

run().catch(console.error)