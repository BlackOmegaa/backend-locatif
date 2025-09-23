import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendAlert(value: number) {
        await this.mailerService.sendMail({
            to: 'seriai.riyad@gmail.com',
            subject: '⚠️ Alerte qualité de l’air critique !',
            template: '../../template/alerte.hbs', // cherche alerte.hbs dans templates/
            context: {
                value, // injecté dans {{ value }}
            },
        });
    }

}
