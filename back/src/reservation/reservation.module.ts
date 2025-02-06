import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [ReservationService, PrismaService],
  controllers: [ReservationController]
})
export class ReservationModule {}
