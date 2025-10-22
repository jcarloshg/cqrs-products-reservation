export class SendEmailService {

    constructor() { }

    public async send(props: SendEmailServiceProps): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export interface SendEmailServiceProps {
    to: string;
    subject: string;
    body: string;
    isBodyHtml?: boolean;
}