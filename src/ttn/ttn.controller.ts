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

    @Get('last')
    async getLast() {
        const last = await this.uplinkService.getLastUplink();
        return {
            temperature: last?.temperature ?? null,
            humidity: last?.humidity ?? null,
            pressure: last?.pressure ?? null,
            gas: last?.gas ?? null
        };
    }



    // Pour récupérer historique (graphes)
    @Get()
    async getAll() {
        return this.uplinkService.getLastUplinks();
    }
}
