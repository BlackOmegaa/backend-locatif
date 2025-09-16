import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TtnService {
    constructor(private prisma: PrismaService) { }

    async saveUplink(data: any) {
        const uplinkMsg = data.uplink_message;

        return this.prisma.uplink.create({
            data: {
                deviceId: data.end_device_ids.device_id,
                receivedAt: new Date(data.received_at),
                temperature: uplinkMsg?.decoded_payload?.temperature ?? null,
                humidity: uplinkMsg?.decoded_payload?.humidity ?? null,
                rawPayload: uplinkMsg,
            },
        });
    }

    async getLastUplinks(limit = 10) {
        return this.prisma.uplink.findMany({
            orderBy: { receivedAt: 'desc' },
            take: limit,
        });
    }

    async getLastTemperature() {
        const last = await this.prisma.uplink.findFirst({
            orderBy: { receivedAt: 'desc' },
        });
        return last?.temperature ?? null;
    }
}
