import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-events';
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated; // damit sagt man TS, dass subject immer vom Type Subjects.TicketCreated ist
  // und dass sein Wert dem Wert in der Enum Subjects TicketCreated entspricht
  // mit readonly kann man die Variable nicht mehr veraendern - die folgende Zeile ist gleichwertig mit der oberen:
  // readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data:', data);

    // business logic was sucessful ...
    msg.ack();
  }
}
