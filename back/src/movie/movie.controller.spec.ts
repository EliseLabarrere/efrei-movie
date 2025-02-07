import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movie.controller';
import { MovieService } from './movie.service';
import { AuthGuard } from '../auth/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MovieService,
          useValue: {
            requestTMDB: jest.fn(),
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

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNowPlaying', () => {
    it('should return movies currently playing', async () => {
      const mockResponse = { results: [{ id: 1, title: 'Movie 1' }] };
      jest.spyOn(service, 'requestTMDB').mockResolvedValue(mockResponse);

      const result = await controller.getNowPlaying();

      expect(result).toEqual(mockResponse);
      expect(service.requestTMDB).toHaveBeenCalledWith('/movie/now_playing', 'GET');
    });
  });

  describe('getSearchMovie', () => {
    it('should return search results for a movie', async () => {
      const queryParams = { query: 'Inception' };
      const mockResponse = { results: [{ id: 1, title: 'Inception' }] };
      jest.spyOn(service, 'requestTMDB').mockResolvedValue(mockResponse);

      const result = await controller.getSearchMovie(queryParams);

      expect(result).toEqual(mockResponse);
      expect(service.requestTMDB).toHaveBeenCalledWith('/search/movie?query=Inception', 'GET');
    });

    it('should return error message if query param is missing', async () => {
      const queryParams = {};
      const result = await controller.getSearchMovie(queryParams);

      expect(result).toEqual({ message: 'Le paramètre "query" est obligatoire' });
    });
  });
});
