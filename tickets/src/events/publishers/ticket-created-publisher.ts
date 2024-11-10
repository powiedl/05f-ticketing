import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@powidl2024/common__powidl2024';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
