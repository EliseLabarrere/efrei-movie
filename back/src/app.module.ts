import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),AuthModule, UsersModule, MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
