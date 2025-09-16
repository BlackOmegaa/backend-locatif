import { Controller, Get, Post, Body } from '@nestjs/common';
import { TtnService } from './ttn.service';

@Controller('ttn')
export class TtnController {
    constructor(private readonly uplinkService: TtnService) { }

    // Endpoint appelé par TTN Webhook
    @Post()
    async handleUplink(@Body() body: any) {
        console.log('Uplink reçu:', JSON.stringify(body, null, 2));
        return this.uplinkService.saveUplink(body);
    }

    // Endpoint pour ton dashboard Angular
    @Get('last')
    async getLast() {
        return { temperature: await this.uplinkService.getLastTemperature() };
    }

    // Pour récupérer historique (graphes)
    @Get()
    async getAll() {
        return this.uplinkService.getLastUplinks();
    }
}
