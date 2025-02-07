import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
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

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);
      jest.spyOn(userService, 'create').mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword'
      });

      const result = await controller.register({ username: 'testuser', password: 'Test123' });
      expect(result).toEqual({ message: 'Utilisateur enregistré avec succès', userId: 1 });
    });

    it('should throw BadRequestException if user already exists', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword'
      });

      await expect(controller.register({ username: 'testuser', password: 'Test123' }))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('signIn', () => {
    it('should return an access token', async () => {
      jest.spyOn(authService, 'signIn').mockResolvedValue({ access_token: 'mock_token' });

      const result = await controller.signIn({ username: 'testuser', password: 'Test123' });
      expect(result).toEqual({ access_token: 'mock_token' });
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const req = { user: { id: 1, username: 'testuser' } };
      const result = controller.getProfile(req);

      expect(result).toEqual(req.user);
    });
  });
});

