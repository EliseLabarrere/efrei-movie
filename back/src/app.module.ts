import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { MoviesModule } from './movie/movie.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),AuthModule, UsersModule, MoviesModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
