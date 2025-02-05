import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movie.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
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

  @Get('search-movie')
  @ApiBearerAuth()
  @ApiQuery({ name: 'query', required: true, description: 'Mot-clé de la recherche' })
  @ApiQuery({ name: 'include_adult', required: false, description: 'Inclu des adultes' })
  @ApiQuery({ name: 'language', required: false, description: 'Langue des résultats (ex: en, fr)' })
  @ApiQuery({ name: 'primary_release_year', required: false, description: '' })
  @ApiQuery({ name: 'page', required: false, description: '' })
  @ApiQuery({ name: 'region', required: false, description: '' })
  @ApiQuery({ name: 'year', required: false, description: '' })
  @ApiResponse({ status: 201, description: 'Film trouvé avec succès' })
  @ApiResponse({ status: 400, description: 'Échec : aucun film trouvé ou paramètre manquant' })
  @ApiResponse({ status: 401, description: 'Token manquant ou non-valide' })
  @ApiOperation({ summary: 'Recherche film' })
  @UseGuards(AuthGuard)
  async getSearchMovie(@Query() queryParams: Record<string, string>) {
    const params = new URLSearchParams(queryParams).toString();

    if (!queryParams.query) {
      return { message: 'Le paramètre "query" est obligatoire' };
    }

    return this.moviesService.requestTMDB(`/search/movie?${params}`, 'GET');
  }
}