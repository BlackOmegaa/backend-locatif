import { Module } from '@nestjs/common';
import { TtnService } from './ttn.service';
import { TtnController } from './ttn.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [TtnController],
    providers: [TtnService, PrismaService],
})
export class TtnModule { }
