import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token if credentials are valid', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock_access_token');

      const result = await service.signIn('testuser', 'password');
      expect(result).toEqual({ access_token: 'mock_access_token' });
      expect(userService.findOne).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 1, username: 'testuser' });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      await expect(service.signIn('unknownuser', 'password'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.signIn('testuser', 'wrongpassword'))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});
