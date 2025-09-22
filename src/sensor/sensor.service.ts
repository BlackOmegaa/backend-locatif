import { Injectable } from '@nestjs/common';
import { SmsService } from 'src/sms.service';

@Injectable()
export class SensorService {
    private lastAlertTime = 0; // timestamp du dernier envoi
    private readonly cooldownMs = 5 * 60 * 1000; // 5 minutes

    constructor(private smsService: SmsService) { }

    async handleSensorData(value: number) {
        console.log(`Nouvelle valeur capteur: ${value}`);

        const now = Date.now();

        if (value > 200 && now - this.lastAlertTime > this.cooldownMs) {
            console.log('Valeur critique détectée, envoi SMS...');
            await this.smsService.sendSmsAlert(value);
            this.lastAlertTime = now;
        }
    }
}
