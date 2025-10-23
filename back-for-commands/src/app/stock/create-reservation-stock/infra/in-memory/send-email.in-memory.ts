import { SendEmailService, SendEmailServiceProps } from "@/app/shared/domain/services/send-email.service";

export class SendEmailInMemory implements SendEmailService {

    constructor() { }

    public async send(props: SendEmailServiceProps): Promise<void> {
        return new Promise((resolve) => {
            console.log("Sending email (In-Memory):", props);
            setTimeout(() => resolve(), 1000);
        });
    }
}