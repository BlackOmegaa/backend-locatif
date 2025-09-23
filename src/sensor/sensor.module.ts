import { Module } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { MailService } from 'src/mail/mail.service';

@Module({
    controllers: [SensorController],
    providers: [SensorService, MailService],
})
export class SensorModule { }
