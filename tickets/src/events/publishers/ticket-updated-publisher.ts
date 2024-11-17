import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
  TicketUpdatedEventIndependentVersioning,
} from '@powidl2024/common__powidl2024';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

export class TicketUpdatedPublisherIndependentVersioning extends Publisher<TicketUpdatedEventIndependentVersioning> {
  readonly subject = Subjects.TicketUpdated;
}
