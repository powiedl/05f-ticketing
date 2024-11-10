import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';
console.clear();
const withListenerClass = true; // true - verwendet die Klasse TicketCreatedListener, false - verwendet die sample listener
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  if (withListenerClass) {
    new TicketCreatedListener(stan).listen();
  } else {
    // #region sample listener
    const options = stan
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable() // alle Events abholen - für den ersten Startup des Services "notwendig"
      .setDurableName('accounting-service'); // nur noch nicht verarbeitete Events abholen - für Restarts des Services
    const subscription = stan.subscribe(
      'ticket:created',
      'listenerQueueGroup',
      options
    );

    subscription.on('message', (msg: Message) => {
      //console.log('Message received: ', msg);
      const data = msg.getData();
      if (typeof data === 'string') {
        console.log(`Received event #${msg.getSequence()}:`, JSON.parse(data));
      }

      msg.ack();
    });
    // #endregion
  }
});

// calls stan.close if the process receives a SIGINT or SIGTERM signal
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

// #region Base Listener Class
// #endregion
