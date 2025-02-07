import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },  
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const userMock = { id: 1, username: 'testuser', password: 'hashedpassword' };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(userMock);

      const result = await service.findOne('testuser');
      expect(result).toEqual(expect.objectContaining(userMock));
    });

    it('should return null if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      const result = await service.findOne('unknownuser');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const userMock = { id: 1, username: 'newuser', password: 'plaintextpassword' };
      const hashedPassword = 'hashedpassword';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      jest.spyOn(prisma.user, 'create').mockResolvedValue({ ...userMock, password: hashedPassword });

      const result = await service.create('newuser', 'plaintextpassword');
      expect(result).toEqual(expect.objectContaining({
        id: 1,
        username: 'newuser',
        password: hashedPassword,
      }));
      expect(bcrypt.hash).toHaveBeenCalledWith('plaintextpassword', 10);
    });
  });
});
