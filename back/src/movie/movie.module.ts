import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MovieService } from './movie.service';
import { MoviesController } from './movie.controller';

@Module({
  imports: [HttpModule],
  controllers: [MoviesController],
  providers: [MovieService],
})
export class MoviesModule {}