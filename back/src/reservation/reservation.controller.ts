import { Body, Req, Controller, Post, Get, Delete, Query, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Reservation')
@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) { }

    @Post()
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                dateTime: { type: 'string', example: '2025-05-01T10:00:00Z' },
                idFilm: { type: 'string', example: '123' },
            },
            required: ['dateTime', 'idFilm']
        },
    })
    @ApiResponse({ status: 201, description: 'Réservation réalisé avec succès' })
    @ApiResponse({ status: 400, description: 'Échec réservations utilisateur' })
    @ApiResponse({ status: 401, description: 'Token manquant ou non-valide' })
    @ApiOperation({ summary: 'Créer une réservation' })
    @UseGuards(AuthGuard)
    async reserve(@Body() reservation: Record<string, any>, @Req() req) {
        if (!req.user || !req.user.sub) { // Vérifie si user et sub existent
            throw new UnauthorizedException('Utilisateur non autorisé');
        }
        const userId = req.user.sub
        
        return this.reservationService.create(userId, reservation.dateTime, reservation.idFilm);
    }

    @Get()
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'Réservations utilisateur' })
    @ApiResponse({ status: 400, description: 'Échec récupération réservations utilisateur' })
    @ApiResponse({ status: 401, description: 'Token manquant ou non-valide' })
    @ApiResponse({ status: 409, description: 'Réservation déjà existante' })
    @ApiOperation({ summary: 'Récupérer réservations utilisateur' })
    @UseGuards(AuthGuard)
    async findAll(@Req() req) {
        if (!req.user || !req.user.sub) { // Vérifie si user et sub existent
            throw new UnauthorizedException('Utilisateur non autorisé');
        }
        const userId = req.user.sub

        return this.reservationService.findAll(userId);
    }


    @Delete()
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                session: { type: 'string', example: '2025-05-01T10:00:00Z' },
            },
            required: ['dateTime', 'idFilm']
        },
    })
    @ApiResponse({ status: 201, description: 'Réservation annulé' })
    @ApiResponse({ status: 400, description: 'Écheréservations utilisateurc suppression reservation' })
    @ApiResponse({ status: 401, description: 'Token manquant ou non-valide' })
    @ApiOperation({ summary: 'Annuler une réservation' })
    @UseGuards(AuthGuard)
    async delete(@Body() reservation: Record<string, any>, @Req() req) {
        if (!req.user || !req.user.sub) {
            throw new UnauthorizedException('Utilisateur non autorisé');
        }
        const userId = req.user.sub

        return this.reservationService.delete(userId, new Date(reservation.session));
    }
}
