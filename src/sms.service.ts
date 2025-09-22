import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class SmsService {
    private client: Twilio.Twilio;

    constructor() {
        this.client = Twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN,
        );
    }

    async sendSmsAlert(value: number) {
        return this.client.messages.create({
            body: `⚠️ Alerte qualité de l'air critique ! Restez chez vous pour éviter tout risque. Valeur détectée: ${value}`,
            from: "+12272382860", // ton numéro Twilio trial
            to: "+33602449574",    // ton numéro vérifié
        });
    }
}
