import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@powidl2024/common__powidl2024';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
