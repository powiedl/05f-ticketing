import { Subjects } from './subjects';

export interface TicketCreatedEvent {
  // damit koppelt man das Subject des Events mit den Datentypen des Events
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
