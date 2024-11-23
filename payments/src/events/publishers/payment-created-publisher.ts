import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@powidl2024/common__powidl2024';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
