import { Module } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { SmsService } from '../sms.service';

@Module({
    controllers: [SensorController],
    providers: [SensorService, SmsService],
})
export class SensorModule { }
