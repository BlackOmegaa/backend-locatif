import { Controller, Post, Body } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
    constructor(private readonly sensorService: SensorService) { }

    @Post()
    async postSensorData(@Body() body: { value: number }) {
        await this.sensorService.handleSensorData(body.value);
        return {
            status: 'ok',
            received: body.value,
        };
    }
}
