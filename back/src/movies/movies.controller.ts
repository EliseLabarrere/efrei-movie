import { Controller, Get, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }
  
  @Get('now-playing')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Films récupérés avec succès' })
  @ApiResponse({ status: 400, description: 'Échec récupération films' })
  @ApiResponse({ status: 401, description: 'Token manquant ou non-valide' })
  @ApiOperation({ summary: 'Récupérer films à l\'affiche' })
  @UseGuards(AuthGuard)
  async getNowPlaying() {
    return this.moviesService.requestTMDB('/movie/now_playing', 'GET');
  }
}