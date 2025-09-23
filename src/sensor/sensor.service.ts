import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class SensorService {
    private lastAlertTime = 0;
    private readonly cooldownMs = 5 * 60 * 1000; // 5 minutes

    constructor(private mailService: MailService) { }

    async handleSensorData(value: number) {
        console.log(`Nouvelle valeur capteur: ${value}`);

        const now = Date.now();
        if (value > 200 && now - this.lastAlertTime > this.cooldownMs) {
            console.log('Valeur critique détectée, envoi email...');
            await this.mailService.sendAlert(value);
            this.lastAlertTime = now;
        }
    }
}
