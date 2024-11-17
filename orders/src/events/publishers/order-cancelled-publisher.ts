import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@powidl2024/common__powidl2024';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
