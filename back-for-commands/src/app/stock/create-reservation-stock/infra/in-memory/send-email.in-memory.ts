import { SendEmailService, SendEmailServiceProps } from "@/app/stock/create-reservation-stock/domain/services/email/send-email.service";

export class SendEmailInMemory implements SendEmailService {

    constructor() { }

    public async send(props: SendEmailServiceProps): Promise<void> {
        return new Promise((resolve) => {
            console.log("Sending email (In-Memory):", props);
            setTimeout(() => resolve(), 1000);
        });
    }
}