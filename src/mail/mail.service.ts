import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendAlert(value: number) {
        await this.mailerService.sendMail({
            to: 'ton.email@exemple.com', // 👉 mets ton adresse ici
            subject: '⚠️ Alerte qualité de l’air critique !',
            text: `Valeur détectée: ${value}`,
            html: `<p><b>Alerte :</b> La qualité de l'air est critique.<br/>Valeur mesurée : <b>${value}</b></p>`,
        });
    }
}
