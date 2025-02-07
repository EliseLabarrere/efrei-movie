import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma.service';
import { ConflictException } from '@nestjs/common';
import { Reservation } from './reservation.model';

describe('ReservationService', () => {
  let service: ReservationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: PrismaService,
          useValue: {
            reservation: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of reservations', async () => {
      const reservationMock = [{ id: 1, userId: 1, idFilm: 123, session: new Date() }];
      jest.spyOn(prisma.reservation, 'findMany').mockResolvedValue(reservationMock);

      const result = await service.findAll(1);
      expect(result).toEqual(expect.arrayContaining(reservationMock));
    });
  });

  describe('create', () => {
    it('should create a new reservation if none exists', async () => {
      const reservationMock = { id: 1, userId: 1, idFilm: 123, session: new Date() };
      jest.spyOn(prisma.reservation, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prisma.reservation, 'create').mockResolvedValue(reservationMock);

      const result = await service.create(1, reservationMock.session.toISOString(), '123');
      expect(result).toEqual(expect.objectContaining(reservationMock));
    });

    it('should throw ConflictException if reservation already exists', async () => {
      const reservationMock = { id: 1, userId: 1, idFilm: 123, session: new Date() };
      jest.spyOn(prisma.reservation, 'findFirst').mockResolvedValue(reservationMock);

      await expect(service.create(1, reservationMock.session.toISOString(), '123'))
        .rejects
        .toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should return success message if reservation deleted', async () => {
      jest.spyOn(prisma.reservation, 'deleteMany').mockResolvedValue({ count: 1 });

      const result = await service.delete(1, new Date());
      expect(result).toEqual({ message: 'Réservation supprimée avec succès' });
    });

    it('should return failure message if no reservation found', async () => {
      jest.spyOn(prisma.reservation, 'deleteMany').mockResolvedValue({ count: 0 });

      const result = await service.delete(1, new Date());
      expect(result).toEqual({ message: 'Aucune réservation trouvée pour suppression' });
    });
  });
});
