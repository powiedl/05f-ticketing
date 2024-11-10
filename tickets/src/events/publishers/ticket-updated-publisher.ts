import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@powidl2024/common__powidl2024';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
