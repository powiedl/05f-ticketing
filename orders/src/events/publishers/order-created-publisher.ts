import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@powidl2024/common__powidl2024';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

//new OrderCreatedPublisher
