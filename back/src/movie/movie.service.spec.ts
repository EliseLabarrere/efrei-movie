import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');

describe('MovieService', () => {
  let service: MovieService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'TMDB_API_URL') return 'https://api.themoviedb.org/3';
              if (key === 'TMDB_API_KEY') return 'fake_api_key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('requestTMDB', () => {
  //   it('should call axios with correct parameters and return data', async () => {
  //     const endpoint = '/movie/939243';
  //     const mockResponse = { data: { id: 550, title: 'Fight Club' } };
  //     (axios.request as jest.Mock).mockResolvedValue(mockResponse);

  //     const result = await service.requestTMDB(endpoint);

  //     expect(axios.request).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         method: 'GET',
  //         url: 'https://api.themoviedb.org/3/movie/1035048',
  //         headers: expect.objectContaining({
  //           Authorization: `Bearer fake_api_key`,
  //         }),
  //       })
  //     );
  //     expect(result).toEqual(mockResponse.data);
  //   });

  //   it('should throw an error if request fails', async () => {
  //     const endpoint = '/movie/939243';
  //     const errorMessage = 'Request failed';
  //     (axios.request as jest.Mock).mockRejectedValue(new Error(errorMessage));

  //     await expect(service.requestTMDB(endpoint)).rejects.toThrow(errorMessage);
  //   });
  // });
});
