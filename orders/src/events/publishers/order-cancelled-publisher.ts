import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
  OrderCancelledEventIndependentVersioning,
} from '@powidl2024/common__powidl2024';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

export class OrderCancelledPublisherIndependentVersioning extends Publisher<OrderCancelledEventIndependentVersioning> {
  readonly subject = Subjects.OrderCancelled;
}
