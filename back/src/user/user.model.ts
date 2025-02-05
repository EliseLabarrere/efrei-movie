import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 1, description: 'ID' })
  userId: number;

  @ApiProperty({ example: 'john', description: 'Nom utilisateur' })
  username: string;

  @ApiProperty({ example: 'changeme', description: 'Mot de passe' })
  password: string;
}
