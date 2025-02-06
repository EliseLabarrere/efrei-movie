import { Injectable, ConflictException  } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Reservation } from './reservation.model';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) { }

  async findAll(userId: number): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { userId },
    });

    return reservations.map(this.mapToReservationModel);
  }

  async create(userId: number, dateTime: string, idFilm: string): Promise<Reservation> {
    const sessionDate = new Date(dateTime);

    const existingReservation = await this.prisma.reservation.findFirst({
      where: {
        userId: userId,
        session: sessionDate,
        idFilm: Number(idFilm),
      },
    });

    if (existingReservation) {
      throw new ConflictException('Réservation déjà existante');
    }

    const createdReservation = await this.prisma.reservation.create({
      data: {
        userId: userId,
        session: sessionDate,
        idFilm: Number(idFilm),
      },
    });

    return this.mapToReservationModel(createdReservation);
  }

  async delete(userId: number, session: Date): Promise<{ message: string }> {
    const deletedReservation = await this.prisma.reservation.deleteMany({
      where: { userId, session },
    });

    return deletedReservation.count > 0
      ? { message: 'Réservation supprimée avec succès' }
      : { message: 'Aucune réservation trouvée pour suppression' };
  }

  private mapToReservationModel(data: any): Reservation {
    const reservation = new Reservation();
    reservation.id = data.id;
    reservation.idFilm = data.idFilm;
    reservation.idUser = data.userId;
    reservation.session = data.session;
    return reservation;
  }
}