import { ApiProperty } from '@nestjs/swagger';

export class Reservation {
  @ApiProperty({ example: 1, description: 'ID' })
  id: number;

  @ApiProperty({ example: 16654, description: 'ID TMDB du film' })
  idFilm: number;

  @ApiProperty({ example: 1, description: 'ID de l\'utilisateur' })
  userId: number;

  @ApiProperty({ example: 'changeme', description: 'Date et heure' })
  session: Date;
}