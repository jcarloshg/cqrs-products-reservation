import { EventHandler } from "@/app/shared/domain/domain-events/event-handler";
import { ReservationSetAsConfirmedDomainEvent } from "./reservation-set-as-confirmed.domain-event";

export class NotifyToOwnerReservationSetAsConfirmedEventHandler
    implements EventHandler<ReservationSetAsConfirmedDomainEvent> {
    public async handle(
        event: ReservationSetAsConfirmedDomainEvent
    ): Promise<void> {
        try {
            const reservationConfirmed = event.reservationConfirmed;
            const title = "Reservation Confirmed";
            const message = `Your reservation with ID: ${reservationConfirmed.ownerUuid} has been confirmed successfully.`;
            console.log("Notification Sent:", { title, message });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
}
