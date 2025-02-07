import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { AuthGuard } from '../auth/auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_token'),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('reserve', () => {
    it('should call reservationService.create and return a reservation', async () => {
      const reservationMock = { id: 1, idFilm: 123, userId: 1, session: new Date() };
      jest.spyOn(service, 'create').mockResolvedValue(reservationMock);

      const req = { user: { sub: 1 } };
      const body = { dateTime: reservationMock.session.toISOString(), idFilm: '123' };
      const result = await controller.reserve(body, req);

      expect(result).toEqual(reservationMock);
      expect(service.create).toHaveBeenCalledWith(1, body.dateTime, body.idFilm);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const req = { user: null };
      const body = { dateTime: '2025-05-01T10:00:00Z', idFilm: '123' };
      await expect(controller.reserve(body, req)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findAll', () => {
    it('should return all reservations for the authenticated user', async () => {
      const reservationMock = [{ id: 1, idFilm: 123, userId: 1, session: new Date() }];
      jest.spyOn(service, 'findAll').mockResolvedValue(reservationMock);

      const req = { user: { sub: 1 } };
      const result = await controller.findAll(req);

      expect(result).toEqual(reservationMock);
      expect(service.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('delete', () => {
    it('should call reservationService.delete and return a success message', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue({ message: 'Réservation supprimée avec succès' });

      const req = { user: { sub: 1 } };
      const body = { session: '2025-05-01T10:00:00Z' };
      const result = await controller.delete(body, req);

      expect(result).toEqual({ message: 'Réservation supprimée avec succès' });
      expect(service.delete).toHaveBeenCalledWith(1, new Date(body.session));
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const req = { user: null };
      const body = { session: '2025-05-01T10:00:00Z' };
      await expect(controller.delete(body, req)).rejects.toThrow(UnauthorizedException);
    });
  });
});
