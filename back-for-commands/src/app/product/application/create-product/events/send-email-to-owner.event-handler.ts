import { CreateProductDomainEvent } from "@/app/product/domain/domain-events/create-product.domain-event";
import { EventHandler } from "@/app/shared/domain/domain-events/event-handler";

export class SendEmailToOwnerEventHandler implements EventHandler<CreateProductDomainEvent> {
    constructor() { }
    async handle(event: CreateProductDomainEvent): Promise<void> {
        const { occurredOn, sku, name, description } = event;
        const emailBody = `
            A new product has been created:
                - Name: ${name}
                - Description: ${description}
                - SKU: ${sku}
                - Created At: ${occurredOn}
        `;
        console.log(emailBody);
        // Here you can implement the logic to send an email to the owner
        // using your preferred email service provider.
    }
}