import { EventHandler } from "@/app/shared/domain/domain-events/event-handler";
import { EventError } from "@/app/shared/domain/errors/event.error";
import { CreateReservationStockDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/create-reservation-stock.doamin-event";
import { SendEmailService, SendEmailServiceProps } from "@/app/stock/create-reservation-stock/domain/services/email/send-email.service";
import { GetUserByUuidRepository } from "@/app/stock/create-reservation-stock/domain/services/repository/get-user-by-uuid.repository";

export class NotifyReservationOwnerEventHandler implements EventHandler<CreateReservationStockDomainEvent> {

    constructor(
        private readonly _sendEmailService: SendEmailService,
        private readonly _getUserByUuidRepository: GetUserByUuidRepository,
    ) { }

    public subscribeTo(): string {
        return CreateReservationStockDomainEvent.eventName;
    }

    public async handle(event: CreateReservationStockDomainEvent): Promise<void> {
        try {
            const { props } = event;

            const user = await this._getUserByUuidRepository.findById(props.ownerUuid);
            if (!user) {
                throw new EventError(
                    `User with UUID ${props.ownerUuid} not found.`,
                    {
                        input: props,
                        output: {
                            userFound: user,
                        }
                    }
                );
            };

            const subject = "Reservation Confirmation";
            const body = `Your reservation for product ID: ${props.productId} has been confirmed. Reserved quantity: ${props.quantity}.`;
            // TODO: this is an example, email doesn't exist on table
            const to = `${user.getProps()}@cqrs-example.com`;

            const sendEmailServiceProps: SendEmailServiceProps = {
                body: body,
                subject: subject,
                to: to,
            }

            await this._sendEmailService.send(sendEmailServiceProps);

        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
}
